
# apps/assets/views/asset_category_views.py
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import AssetCategory
from ..serializers import AssetCategorySerializer
from core.utils.mixins import BaseViewSetMixin  # Import corrigido

class AssetCategoryViewSet(BaseViewSetMixin, viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de categorias de ativos.
    """
    queryset = AssetCategory.objects.all()
    serializer_class = AssetCategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['enabled', 'asset_group']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created']
    ordering = ['name']

    def get_queryset(self):
        """
        Sobrescreve o queryset para incluir apenas categorias de grupos ativos
        """
        return super().get_queryset().filter(asset_group__enabled=True)
