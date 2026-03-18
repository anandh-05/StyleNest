from django.db.models import Avg, Count, Prefetch
from rest_framework import generics, mixins, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Order, Product, ProductImage, ProductReview
from .permissions import IsAdminOrReadOnly
from .serializers import (
    CustomTokenObtainPairSerializer,
    OrderSerializer,
    PaymentSimulationSerializer,
    ProductDetailSerializer,
    ProductReviewCreateSerializer,
    ProductReviewSerializer,
    ProductSerializer,
    ProductWriteSerializer,
    RegisterSerializer,
    UserSerializer,
)


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Product.objects.annotate(
            average_rating_value=Avg("reviews__rating"),
            review_count_value=Count("reviews", distinct=True),
        )

        if self.action == "retrieve":
            return queryset.prefetch_related(
                Prefetch("reviews", queryset=ProductReview.objects.select_related("user")),
                Prefetch("gallery_images", queryset=ProductImage.objects.all()),
            )

        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        if self.action in {"create", "update", "partial_update"}:
            return ProductWriteSerializer
        return ProductSerializer

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def reviews(self, request, pk=None):
        product = self.get_object()
        serializer = ProductReviewCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        review, created = ProductReview.objects.update_or_create(
            product=product,
            user=request.user,
            defaults=serializer.validated_data,
        )

        response_serializer = ProductReviewSerializer(review)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class CurrentUserAPIView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class OrderViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects.filter(user=self.request.user)
            .select_related("user")
            .prefetch_related("items", "items__product")
        )


class PaymentSimulationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PaymentSimulationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        amount = f"{data['amount']:.2f}"
        provider = data["provider"]
        payment_reference = f"{provider[:3].upper()}-SIM-{request.user.id:04d}"

        return Response(
            {
                "status": "success",
                "provider": provider,
                "currency": data["currency"],
                "amount": amount,
                "payment_reference": payment_reference,
                "message": "Payment simulated successfully. Replace this endpoint with Razorpay or Stripe server-side integration later.",
            }
        )
