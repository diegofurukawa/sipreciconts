from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet, 
    TaxViewSet, 
    SupplyViewSet,
    AssetViewSet,
    AssetGroupViewSet,
    AssetCategoryViewSet,
    AssetMovementViewSet,
    CompanyViewSet,
    UserViewSet
)
from .auth_custom.views import LoginView, LogoutView, ValidateTokenView, TokenRefreshView

# Configuração do router para ViewSets
router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'users', UserViewSet, basename='user')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'taxes', TaxViewSet)
router.register(r'supplies', SupplyViewSet, basename='supply')
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'asset-groups', AssetGroupViewSet, basename='asset-group')
router.register(r'asset-categories', AssetCategoryViewSet, basename='asset-category')
router.register(r'asset-movements', AssetMovementViewSet, basename='asset-movement')

# URLs de autenticação
auth_urls = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/validate/', ValidateTokenView.as_view(), name='validate-token'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]


# Combinando todas as URLs
urlpatterns = [
    path('', include(router.urls)),
    *auth_urls,
]