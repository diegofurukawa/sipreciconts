from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    # Redireciona a raiz para o admin
    path('', lambda request: redirect('admin/', permanent=False)),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')),

    # Swagger/OpenAPI
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

# Adiciona URLs para servir arquivos estáticos em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
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