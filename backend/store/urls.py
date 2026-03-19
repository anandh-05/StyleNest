from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CurrentUserAPIView,
    HealthCheckAPIView,
    LoginAPIView,
    OrderViewSet,
    PaymentSimulationAPIView,
    ProductViewSet,
    RegisterAPIView,
)

router = DefaultRouter(trailing_slash=False)
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("health", HealthCheckAPIView.as_view(), name="health"),
    path("auth/register", RegisterAPIView.as_view(), name="register"),
    path("auth/login", LoginAPIView.as_view(), name="login"),
    path("auth/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me", CurrentUserAPIView.as_view(), name="current_user"),
    path("payments/simulate", PaymentSimulationAPIView.as_view(), name="simulate_payment"),
    path("", include(router.urls)),
]
