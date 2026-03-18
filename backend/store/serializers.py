from decimal import Decimal
from uuid import uuid4

from django.contrib.auth import get_user_model
from django.db.models import Avg
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Order, OrderItem, Product, ProductImage, ProductReview

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "is_staff")


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "first_name",
            "last_name",
            "password",
            "password_confirm",
        )

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password_confirm"):
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class ProductReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)

    class Meta:
        model = ProductReview
        fields = (
            "id",
            "user_id",
            "username",
            "rating",
            "title",
            "comment",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user_id", "username", "created_at", "updated_at")


class ProductReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = ("rating", "title", "comment")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "sort_order")


class ProductSerializer(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "image",
            "category",
            "stock",
            "size",
            "color",
            "created_at",
            "updated_at",
            "average_rating",
            "review_count",
        )

    def get_average_rating(self, obj):
        annotated_rating = getattr(obj, "average_rating_value", None)
        if annotated_rating is None:
            annotated_rating = obj.reviews.aggregate(avg=Avg("rating"))["avg"]
        return round(float(annotated_rating or 0), 1)

    def get_review_count(self, obj):
        annotated_count = getattr(obj, "review_count_value", None)
        if annotated_count is None:
            annotated_count = obj.reviews.count()
        return int(annotated_count or 0)


class ProductDetailSerializer(ProductSerializer):
    reviews = ProductReviewSerializer(many=True, read_only=True)
    gallery_images = ProductImageSerializer(many=True, read_only=True)

    class Meta(ProductSerializer.Meta):
        fields = ProductSerializer.Meta.fields + ("gallery_images", "reviews")


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product_id",
            "product_name",
            "price",
            "quantity",
            "size",
            "color",
            "line_total",
        )

    def get_line_total(self, obj):
        return obj.price * obj.quantity


class OrderCreateItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    order_items = OrderCreateItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "user",
            "shipping_name",
            "shipping_email",
            "shipping_phone",
            "shipping_address",
            "payment_provider",
            "payment_status",
            "payment_reference",
            "status",
            "total_price",
            "created_at",
            "updated_at",
            "items",
            "order_items",
        )
        read_only_fields = (
            "id",
            "user",
            "payment_status",
            "payment_reference",
            "status",
            "total_price",
            "created_at",
            "updated_at",
            "items",
        )

    def validate_order_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one cart item is required.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop("order_items")
        payment_provider = validated_data.pop("payment_provider", "simulation") or "simulation"
        request = self.context["request"]

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                payment_provider=payment_provider,
                payment_status=Order.PaymentStatus.PAID,
                payment_reference=f"SIM-{uuid4().hex[:12].upper()}",
                total_price=Decimal("0.00"),
                **validated_data,
            )

            total_price = Decimal("0.00")
            for item in items_data:
                product = Product.objects.select_for_update().filter(pk=item["product_id"]).first()
                if not product:
                    raise serializers.ValidationError(
                        {"order_items": f"Product with id {item['product_id']} was not found."}
                    )

                quantity = item["quantity"]
                if product.stock < quantity:
                    raise serializers.ValidationError(
                        {"order_items": f"Only {product.stock} item(s) left for {product.name}."}
                    )

                line_total = product.price * quantity
                total_price += line_total
                product.stock -= quantity
                product.save(update_fields=["stock", "updated_at"])

                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    price=product.price,
                    quantity=quantity,
                    size=product.size,
                    color=product.color,
                )

            order.total_price = total_price
            order.save(update_fields=["total_price", "updated_at"])

        return order


class PaymentSimulationSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal("0.01"))
    provider = serializers.ChoiceField(choices=["simulation", "razorpay", "stripe"], default="simulation")
    currency = serializers.CharField(default="INR", max_length=10)
