# apps/assets/views/asset_group_views.py
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from ..models import AssetGroup
from ..serializers import AssetGroupSerializer
from core.utils.mixins import BaseViewSetMixin  # Import corrigido

class AssetGroupViewSet(BaseViewSetMixin, viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de grupos de ativos.
    """
    queryset = AssetGroup.objects.all()
    serializer_class = AssetGroupSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['enabled']
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created']
    ordering = ['name']

    def perform_destroy(self, instance):
        """
        Sobrescreve o método de exclusão para realizar soft delete
        """
        instance.enabled = False
        instance.save()