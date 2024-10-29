# backend/api/serializers.py
from rest_framework import serializers
from .models import Customer, CustomerType, Tax, Supply

# backend/api/serializers/supply.py
# from .base import BaseSerializer

class CustomerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerType
        fields = ['id', 'name', 'description']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'name', 'document', 'customer_type', 'celphone', 
                 'email', 'address', 'complement', 'created', 'updated', 'enabled']

    def validate_document(self, value):
        if value:
            # Remove todos os caracteres não numéricos
            value = ''.join(filter(str.isdigit, value))
        return value

    def validate_celphone(self, value):
        # Remove todos os caracteres não numéricos
        value = ''.join(filter(str.isdigit, value))
        return value
    

# api/serializers.py

# Adicionar junto com o CustomerSerializer
class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = [
            'id',
            'description',
            'type',
            'acronym',
            'group',
            'calc_operator',
            'value',
            'created',
            'updated',
            'enabled'
        ]

class BaseSerializer(serializers.ModelSerializer):
    """Base serializer with common fields"""
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    enabled = serializers.BooleanField(read_only=True)



class SupplySerializer(BaseSerializer):
    """Serializer for Supply model"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    unit_measure_display = serializers.CharField(source='get_unit_measure_display', read_only=True)

    class Meta:
        model = Supply
        fields = [
            'id', 'name', 'nick_name', 'ean_code', 'description',
            'unit_measure', 'unit_measure_display', 'type', 'type_display',
            'created', 'updated', 'enabled'
        ]