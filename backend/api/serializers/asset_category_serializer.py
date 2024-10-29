# apps/assets/serializers/asset_category_serializer.py
from rest_framework import serializers
from ..models import AssetCategory, AssetGroup

class AssetCategorySerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo AssetCategory
    """
    asset_group_name = serializers.CharField(source='asset_group.name', read_only=True)

    class Meta:
        model = AssetCategory
        fields = ['assetcategory_id', 'name', 'code', 'description', 'asset_group', 
                 'asset_group_name', 'enabled', 'created', 'updated']
        read_only_fields = ['created', 'updated']

    def validate_code(self, value):
        """
        Validação personalizada para o código da categoria
        """
        if value:
            value = value.upper().strip()
            if AssetCategory.objects.filter(code__iexact=value).exists():
                if self.instance and self.instance.code.upper() == value:
                    return value
                raise serializers.ValidationError("Já existe uma categoria com este código.")
        return value

    def validate(self, data):
        """
        Validação para garantir que a categoria pertence a um grupo ativo
        """
        asset_group = data.get('asset_group')
        if asset_group and not asset_group.enabled:
            raise serializers.ValidationError({
                "asset_group": "O grupo selecionado está inativo."
            })
        return data