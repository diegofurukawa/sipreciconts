# apps/assets/serializers/asset_group_serializer.py
from rest_framework import serializers
from ..models import AssetGroup

class AssetGroupSerializer(serializers.ModelSerializer):
    """
    Serializer para o modelo AssetGroup
    """
    class Meta:
        model = AssetGroup
        fields = ['id', 'name', 'code', 'description', 'enabled', 'created', 'updated']
        read_only_fields = ['created', 'updated']

    def validate_code(self, value):
        """
        Validação personalizada para o código do grupo
        """
        if value:
            # Converte para maiúsculo e remove espaços
            value = value.upper().strip()
            
            # Verifica se já existe um código igual (case insensitive)
            if AssetGroup.objects.filter(code__iexact=value).exists():
                if self.instance and self.instance.code.upper() == value:
                    return value
                raise serializers.ValidationError("Já existe um grupo com este código.")
        return value