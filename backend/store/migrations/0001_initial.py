# Generated manually for the starter project.
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("description", models.TextField()),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("image", models.URLField(blank=True)),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("clothing", "Clothing"),
                            ("shoes", "Shoes"),
                            ("accessories", "Accessories"),
                            ("outerwear", "Outerwear"),
                            ("athleisure", "Athleisure"),
                        ],
                        default="clothing",
                        max_length=30,
                    ),
                ),
                ("stock", models.PositiveIntegerField(default=0)),
                (
                    "size",
                    models.CharField(
                        choices=[("S", "S"), ("M", "M"), ("L", "L"), ("XL", "XL")],
                        default="M",
                        max_length=2,
                    ),
                ),
                ("color", models.CharField(max_length=50)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("shipping_name", models.CharField(max_length=120)),
                ("shipping_email", models.EmailField(max_length=254)),
                ("shipping_phone", models.CharField(max_length=20)),
                ("shipping_address", models.TextField()),
                ("total_price", models.DecimalField(decimal_places=2, max_digits=10)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("created", "Created"),
                            ("processing", "Processing"),
                            ("shipped", "Shipped"),
                            ("delivered", "Delivered"),
                        ],
                        default="created",
                        max_length=20,
                    ),
                ),
                ("payment_provider", models.CharField(default="simulation", max_length=50)),
                (
                    "payment_status",
                    models.CharField(
                        choices=[("pending", "Pending"), ("paid", "Paid"), ("failed", "Failed")],
                        default="paid",
                        max_length=20,
                    ),
                ),
                ("payment_reference", models.CharField(blank=True, max_length=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="orders",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("product_name", models.CharField(max_length=255)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("quantity", models.PositiveIntegerField(default=1)),
                ("size", models.CharField(blank=True, max_length=10)),
                ("color", models.CharField(blank=True, max_length=50)),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="items",
                        to="store.order",
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="store.product",
                    ),
                ),
            ],
        ),
    ]
