# backend/api/serializers.py
from rest_framework import serializers
from .models import Customer, CustomerType, Tax

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