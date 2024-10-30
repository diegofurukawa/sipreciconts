# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, TaxViewSet, SupplyViewSet
from .views import AssetViewSet
from .views.asset_group import AssetGroupViewSet
from .views.asset_category import AssetCategoryViewSet
from .views.asset_movement import AssetMovementViewSet
from .views.company import CompanyViewSet
from .views.user import UserViewSet
from .views.login import LoginView

router = DefaultRouter()
# Change auth registration to explicitly include login action
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'users', UserViewSet, basename='user')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'taxes', TaxViewSet)
router.register(r'supplies', SupplyViewSet, basename='supply')
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'asset-groups', AssetGroupViewSet, basename='asset-group')
router.register(r'asset-categories', AssetCategoryViewSet, basename='asset-category')
router.register(r'asset-movements', AssetMovementViewSet, basename='asset-movement')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
]