# api/serializers/supplies_price_list_serializer.py
from rest_framework import serializers
from ..models.supplies_price_list_model import SuppliesPriceList
from ..models.supply_model import Supply
from ..models.tax_model import Tax

class SuppliesPriceListSerializer(serializers.ModelSerializer):
    """
    Serializer for SuppliesPriceList model
    """
    supply_name = serializers.CharField(source='supply.name', read_only=True)
    tax_acronym = serializers.CharField(source='tax.acronym', read_only=True)
    company_id = serializers.CharField(source='company.company_id', read_only=True)

    class Meta:
        model = SuppliesPriceList
        fields = [
            # Substitua 'supplies_price_list_id' pelo nome correto do campo ID
            'suppliespricelist_id',  # ou possivelmente 'id' ou o nome real gerado 
            'supply', 
            'supply_name',
            'tax', 
            'tax_acronym',
            'value', 
            'sequence', 
            'company_id',
            'created', 
            'updated', 
            'enabled'
        ]
        read_only_fields = ['created', 'updated', 'company_id']