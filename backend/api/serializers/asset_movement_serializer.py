
# apps/assets/serializers/asset_movement_serializer.py
from rest_framework import serializers
from ..models import AssetMovement, Asset
from decimal import Decimal

class AssetMovementSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo AssetMovement
    """
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)

    class Meta:
        model = AssetMovement
        fields = [
            'assetmovement_id', 'asset', 'asset_name', 'movement_type', 'movement_type_display',
            'quantity', 'from_location', 'to_location', 'reference_document',
            'notes', 'movement_date', 'created_by', 'created_by_name',
            'created', 'updated'
        ]
        read_only_fields = ['created', 'updated', 'created_by']

    def validate(self, data):
        """
        Validações customizadas para movimentações
        """
        asset = data.get('asset')
        quantity = data.get('quantity')
        movement_type = data.get('movement_type')

        if not asset or not quantity:
            return data

        # Validar quantidade para saídas
        if movement_type in ['out', 'transfer']:
            current_quantity = asset.quantity
            if Decimal(str(quantity)) > current_quantity:
                raise serializers.ValidationError({
                    "quantity": f"Quantidade insuficiente. Disponível: {current_quantity}"
                })

        # Validar origem/destino para transferências
        if movement_type == 'transfer':
            from_location = data.get('from_location')
            to_location = data.get('to_location')
            
            if not from_location or not to_location:
                raise serializers.ValidationError({
                    "from_location": "Origem e destino são obrigatórios para transferências."
                })

            if from_location == to_location:
                raise serializers.ValidationError({
                    "to_location": "Origem e destino não podem ser iguais."
                })

        return data

    def create(self, validated_data):
        """
        Sobrescreve o método create para incluir o usuário atual
        """
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)