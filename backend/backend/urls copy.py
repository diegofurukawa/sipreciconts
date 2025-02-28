# backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    # Redireciona a raiz para o admin
    path('', lambda request: redirect('admin/', permanent=False)),
    
    # Admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include('api.urls')),

    # API
    # path('api-docs/', include_docs_urls(title='API Documentation')),  # Use esta abordagem mais simples
]

# Adiciona URLs para servir arquivos estáticos em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)