# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, TaxViewSet, SupplyViewSet
from .views import AssetViewSet
from .views.asset_group_views import AssetGroupViewSet
from .views.asset_category_views import AssetCategoryViewSet
from .views.asset_movement_views import AssetMovementViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'taxes', TaxViewSet)
router.register(r'supplies', SupplyViewSet, basename='supply')  # Adicione esta linha

# Registrar ViewSets do módulo Assets
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'asset-groups', AssetGroupViewSet, basename='asset-group')
router.register(r'asset-categories', AssetCategoryViewSet, basename='asset-category')
router.register(r'asset-movements', AssetMovementViewSet, basename='asset-movement')

urlpatterns = [
    path('', include(router.urls)),
]