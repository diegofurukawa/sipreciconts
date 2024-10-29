
# apps/assets/serializers/asset_serializer.py
from rest_framework import serializers
from ..models import Asset, AssetCategory, AssetGroup
from decimal import Decimal

class AssetSerializer(serializers.ModelSerializer):
    """
    Serializer principal para o modelo Asset
    """
    asset_group_name = serializers.CharField(source='asset_group.name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Asset
        fields = [
            'id', 'name', 'description', 'asset_group', 'asset_group_name',
            'category', 'category_name', 'asset_code', 'patrimony_code',
            'serial_number', 'quantity', 'minimum_quantity', 'unit_measure',
            'purchase_value', 'current_value', 'status', 'status_display',
            'acquisition_date', 'warranty_expiration', 'next_maintenance',
            'location', 'notes', 'enabled', 'created', 'updated'
        ]
        read_only_fields = ['created', 'updated']

    def validate(self, data):
        """
        Validações customizadas para o ativo
        """
        # Validar grupo e categoria
        asset_group = data.get('asset_group')
        category = data.get('category')
        
        if asset_group and category:
            if category.asset_group != asset_group:
                raise serializers.ValidationError({
                    "category": "A categoria selecionada não pertence ao grupo escolhido."
                })

        # Validar quantidade mínima
        quantity = data.get('quantity', 0)
        minimum_quantity = data.get('minimum_quantity', 0)
        
        if Decimal(str(minimum_quantity)) > Decimal(str(quantity)):
            raise serializers.ValidationError({
                "minimum_quantity": "A quantidade mínima não pode ser maior que a quantidade atual."
            })

        # Validar datas
        acquisition_date = data.get('acquisition_date')
        warranty_expiration = data.get('warranty_expiration')
        
        if acquisition_date and warranty_expiration:
            if warranty_expiration < acquisition_date:
                raise serializers.ValidationError({
                    "warranty_expiration": "A data de vencimento da garantia não pode ser anterior à data de aquisição."
                })

        return data

    def validate_asset_code(self, value):
        """
        Validação do código do ativo
        """
        if value:
            value = value.upper().strip()
            if Asset.objects.filter(asset_code__iexact=value).exists():
                if self.instance and self.instance.asset_code.upper() == value:
                    return value
                raise serializers.ValidationError("Já existe um ativo com este código.")
        return value

class AssetListSerializer(AssetSerializer):
    """
    Serializer específico para listagem de ativos (com menos campos)
    """
    class Meta(AssetSerializer.Meta):
        fields = [
            'id', 'name', 'asset_code', 'asset_group_name', 'category_name',
            'quantity', 'status_display', 'location'
        ]
