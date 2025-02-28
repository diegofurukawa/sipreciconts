from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # Spectacular para OpenAPI 3
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# urlpatterns = [
#     # Redireciona a raiz para o admin
#     path('', lambda request: redirect('admin/', permanent=False)),
    
#     # Admin interface
#     path('admin/', admin.site.urls),
    
#     # API endpoints
#     path('api/', include('api.urls')),
    
#     # URLs de documentação separadas das URLs da API
#     path('docs/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
#     path('docs/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
#     # path('api-docs/', include_docs_urls(title='API Documentation')),  # Use esta abordagem mais simples
# ]