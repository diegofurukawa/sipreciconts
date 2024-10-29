# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, TaxViewSet, SupplyViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'taxes', TaxViewSet)
router.register(r'supplies', SupplyViewSet, basename='supply')  # Adicione esta linha

urlpatterns = [
    path('', include(router.urls)),
]