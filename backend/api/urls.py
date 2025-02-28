# api/urls.py
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from .views import (
    CompanyViewSet,
    CustomerViewSet, 
    TaxViewSet,
    SupplyViewSet,
    UserViewSet,
    AssetViewSet,
    AssetGroupViewSet,
    AssetCategoryViewSet,
    AssetMovementViewSet,
    UserSessionViewSet,
)
from .auth_custom.views_auth_custom import (
    LoginView,
    LogoutView,
    ValidateTokenView,
    TokenRefreshView,
    SessionView,
    EndSessionView
)

# Router configuration
router = DefaultRouter()

# Cadastros
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'taxes', TaxViewSet, basename='tax')
router.register(r'supplies', SupplyViewSet, basename='supply')
router.register(r'users', UserViewSet, basename='user')

# Assets
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'asset-groups', AssetGroupViewSet, basename='asset-group')
router.register(r'asset-categories', AssetCategoryViewSet, basename='asset-category')
router.register(r'asset-movements', AssetMovementViewSet, basename='asset-movement')

# Sessions
router.register(r'sessions', UserSessionViewSet, basename='session')

# Authentication URLs
auth_urls = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/validate/', ValidateTokenView.as_view(), name='validate-token'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/sessions/', SessionView.as_view(), name='session-manage'),
    path('auth/sessions/end/', EndSessionView.as_view(), name='session-end'),
]

# Specific URLs
specific_urls = [
    path('companies/current/', 
         CompanyViewSet.as_view({'get': 'current'}), 
         name='company-current'),
    
    path('customers/import/', 
         CustomerViewSet.as_view({'post': 'import_customers'}), 
         name='customer-import'),
    path('customers/export/', 
         CustomerViewSet.as_view({'get': 'export'}), 
         name='customer-export'),
]

# Combining all URLs
urlpatterns = [
    path('', include(router.urls)),
    *auth_urls,
    *specific_urls,
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

app_name = 'api'