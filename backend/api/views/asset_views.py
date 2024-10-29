# apps/assets/views/asset_views.py
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, F
from django.utils import timezone
from ..models import Asset
from ..serializers.asset_serializer import AssetSerializer, AssetListSerializer  # Caminho correto para os serializers
from core.utils.mixins import BaseViewSetMixin
import django_filters

class AssetFilter(django_filters.FilterSet):
    """
    Filtro customizado para ativos
    """
    min_quantity = django_filters.NumberFilter(field_name="quantity", lookup_expr='gte')
    max_quantity = django_filters.NumberFilter(field_name="quantity", lookup_expr='lte')
    location = django_filters.CharFilter(lookup_expr='icontains')
    acquisition_date_after = django_filters.DateFilter(field_name="acquisition_date", lookup_expr='gte')
    acquisition_date_before = django_filters.DateFilter(field_name="acquisition_date", lookup_expr='lte')
    
    class Meta:
        model = Asset
        fields = {
            'enabled': ['exact'],
            'asset_group': ['exact'],
            'category': ['exact'],
            'status': ['exact'],
            'unit_measure': ['exact'],
        }

class AssetViewSet(BaseViewSetMixin, viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de ativos.
    """
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = AssetFilter
    search_fields = ['name', 'asset_code', 'patrimony_code', 'serial_number', 'location']
    ordering_fields = ['name', 'asset_code', 'quantity', 'status', 'created']
    ordering = ['name']

    def get_serializer_class(self):
        """
        Retorna o serializer apropriado baseado na ação
        """
        if self.action == 'list':
            return AssetListSerializer
        return AssetSerializer

    def get_queryset(self):
        """
        Customiza o queryset base
        """
        queryset = super().get_queryset()
        queryset = queryset.select_related('asset_group', 'category')
        
        # Filtro por quantidade mínima
        low_stock = self.request.query_params.get('low_stock', None)
        if low_stock:
            queryset = queryset.filter(quantity__lte=F('minimum_quantity'))
        
        return queryset

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Endpoint para dados do dashboard
        """
        queryset = self.get_queryset()
        
        total_assets = queryset.count()
        low_stock = queryset.filter(quantity__lte=F('minimum_quantity')).count()
        maintenance_needed = queryset.filter(
            Q(next_maintenance__lte=timezone.now()) & 
            Q(status='available')
        ).count()
        
        by_status = queryset.values('status').annotate(
            count=Count('id')
        ).order_by('status')
        
        by_group = queryset.values(
            'asset_group__name'
        ).annotate(
            count=Count('id')
        ).order_by('asset_group__name')

        return Response({
            'total_assets': total_assets,
            'low_stock': low_stock,
            'maintenance_needed': maintenance_needed,
            'by_status': by_status,
            'by_group': by_group
        })