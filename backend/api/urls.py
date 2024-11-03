# api/urls.py
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from .views import (
    # Cadastros
    CompanyViewSet,
    CustomerViewSet, 
    TaxViewSet,
    SupplyViewSet,
    UserViewSet,
    # Assets
    AssetViewSet,
    AssetGroupViewSet,
    AssetCategoryViewSet,
    AssetMovementViewSet,
    # Comercial
    # ContractViewSet,
    # QuoteViewSet,
)
from .auth_custom.views import (
    LoginView,
    LogoutView,
    ValidateTokenView,
    TokenRefreshView,
)

# Configuração do router para ViewSets
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

# Comercial
# router.register(r'contracts', ContractViewSet, basename='contract')
# router.register(r'quotes', QuoteViewSet, basename='quote')

# URLs de autenticação
auth_urls = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/validate/', ValidateTokenView.as_view(), name='validate-token'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]

# Rotas específicas
specific_urls = [
    # Company
    path('companies/current/', 
         CompanyViewSet.as_view({'get': 'current'}), 
         name='company-current'),
    
    # Customer
    path('customers/import/', 
         CustomerViewSet.as_view({'post': 'import_customers'}), 
         name='customer-import'),
    path('customers/export/', 
         CustomerViewSet.as_view({'get': 'export'}), 
         name='customer-export'),
    
    # Contract
    # path('contracts/<int:pk>/approve/', 
    #      ContractViewSet.as_view({'post': 'approve'}), 
    #      name='contract-approve'),
    # path('contracts/<int:pk>/reject/', 
    #      ContractViewSet.as_view({'post': 'reject'}), 
    #      name='contract-reject'),
    
    # # Quote
    # path('quotes/<int:pk>/convert-to-contract/', 
    #      QuoteViewSet.as_view({'post': 'convert_to_contract'}), 
    #      name='quote-convert'),
]

# Combinando todas as URLs
urlpatterns = [
    path('', include(router.urls)),
    *auth_urls,
    *specific_urls,
]

# Servir arquivos de mídia em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Configurações da aplicação
app_name = 'api'

# Documentação das rotas disponíveis
"""
API Endpoints:

Autenticação:
    POST   /api/auth/login/    - Login de usuário
    POST   /api/auth/logout/   - Logout de usuário
    POST   /api/auth/validate/ - Validação de token
    POST   /api/auth/refresh/  - Renovação de token

Empresas:
    GET    /api/companies/           - Lista todas as empresas
    POST   /api/companies/           - Cria uma nova empresa
    GET    /api/companies/{id}/      - Detalhes de uma empresa
    PUT    /api/companies/{id}/      - Atualiza uma empresa
    PATCH  /api/companies/{id}/      - Atualização parcial
    DELETE /api/companies/{id}/      - Remove uma empresa
    GET    /api/companies/current/   - Empresa atual

Clientes:
    GET    /api/customers/           - Lista todos os clientes
    POST   /api/customers/           - Cria um novo cliente
    GET    /api/customers/{id}/      - Detalhes de um cliente
    PUT    /api/customers/{id}/      - Atualiza um cliente
    PATCH  /api/customers/{id}/      - Atualização parcial
    DELETE /api/customers/{id}/      - Remove um cliente
    POST   /api/customers/import/    - Importa clientes
    GET    /api/customers/export/    - Exporta clientes

Assets:
    GET    /api/assets/              - Lista todos os assets
    POST   /api/assets/              - Cria um novo asset
    GET    /api/assets/{id}/         - Detalhes de um asset
    PUT    /api/assets/{id}/         - Atualiza um asset
    DELETE /api/assets/{id}/         - Remove um asset
    
    Similar structure for:
    - /api/asset-groups/
    - /api/asset-categories/
    - /api/asset-movements/

Contratos:
    GET    /api/contracts/           - Lista contratos
    POST   /api/contracts/           - Cria contrato
    GET    /api/contracts/{id}/      - Detalhes do contrato
    PUT    /api/contracts/{id}/      - Atualiza contrato
    DELETE /api/contracts/{id}/      - Remove contrato
    POST   /api/contracts/{id}/approve/  - Aprova contrato
    POST   /api/contracts/{id}/reject/   - Rejeita contrato

Orçamentos:
    GET    /api/quotes/              - Lista orçamentos
    POST   /api/quotes/              - Cria orçamento
    GET    /api/quotes/{id}/         - Detalhes do orçamento
    PUT    /api/quotes/{id}/         - Atualiza orçamento
    DELETE /api/quotes/{id}/         - Remove orçamento
    POST   /api/quotes/{id}/convert-to-contract/ - Converte para contrato
"""