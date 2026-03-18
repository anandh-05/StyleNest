from django.contrib import admin

from .models import Order, OrderItem, Product, ProductImage, ProductReview


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name", "price", "quantity", "size", "color")


class ProductReviewInline(admin.TabularInline):
    model = ProductReview
    extra = 0
    readonly_fields = ("user", "rating", "title", "comment", "created_at", "updated_at")


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ("image", "alt_text", "sort_order")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "stock", "size", "color")
    list_filter = ("category", "size", "color")
    search_fields = ("name", "description")
    inlines = [ProductImageInline, ProductReviewInline]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_price", "status", "payment_status", "created_at")
    list_filter = ("status", "payment_status", "payment_provider")
    search_fields = ("user__username", "shipping_name", "shipping_email")
    inlines = [OrderItemInline]


@admin.register(ProductReview)
class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "user", "rating", "title", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("product__name", "user__username", "title", "comment")


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "sort_order", "alt_text")
    list_filter = ("product__category",)
    search_fields = ("product__name", "alt_text", "image")
