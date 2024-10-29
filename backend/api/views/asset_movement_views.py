
# apps/assets/views/asset_movement_views.py
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from ..models import AssetMovement, Asset
from ..serializers import AssetMovementSerializer
#from utils.mixins import BaseViewSetMixin
from core.utils.mixins import BaseViewSetMixin  # Import atualizado

class AssetMovementViewSet(BaseViewSetMixin, viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de movimentações de ativos.
    """
    queryset = AssetMovement.objects.all()
    serializer_class = AssetMovementSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['movement_type', 'asset', 'movement_date']
    search_fields = ['reference_document', 'notes']
    ordering_fields = ['movement_date', 'created']
    ordering = ['-movement_date']

    def get_queryset(self):
        """
        Customiza o queryset base
        """
        return super().get_queryset().select_related(
            'asset',
            'created_by'
        )

    @transaction.atomic
    def perform_create(self, serializer):
        """
        Sobrescreve o método de criação para atualizar o estoque do ativo
        """
        movement = serializer.save()
        asset = movement.asset
        
        # Atualiza a quantidade do ativo baseado no tipo de movimento
        if movement.movement_type == 'in':
            asset.quantity += movement.quantity
        elif movement.movement_type in ['out', 'transfer']:
            asset.quantity -= movement.quantity
        elif movement.movement_type == 'adjustment':
            asset.quantity = movement.quantity
            
        # Atualiza a localização para transferências
        if movement.movement_type == 'transfer' and movement.to_location:
            asset.location = movement.to_location
            
        asset.save()

    def create(self, request, *args, **kwargs):
        """
        Sobrescreve o método create para adicionar validações adicionais
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Validações adicionais de negócio
        asset = serializer.validated_data['asset']
        quantity = serializer.validated_data['quantity']
        movement_type = serializer.validated_data['movement_type']
        
        if movement_type in ['out', 'transfer']:
            if asset.quantity < quantity:
                return Response(
                    {"detail": "Quantidade insuficiente em estoque."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, 
            status=status.HTTP_201_CREATED, 
            headers=headers
        )