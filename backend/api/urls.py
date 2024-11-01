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
from .views.login import LoginView, LogoutView, ValidateTokenView

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
auth_patterns = [
    path('login/', LoginView.as_view(), name='auth-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('validate-token/', ValidateTokenView.as_view(), name='auth-validate-token'),
]

# Combinando todas as URLs
urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include((auth_patterns, 'auth'), namespace='auth')),
]