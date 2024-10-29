# backend/api/serializers.py
from rest_framework import serializers
from api.models import Customer, CustomerType

class CustomerTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerType
        fields = ['customertype_id', 'name', 'description']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['customer_id', 'name', 'document', 'customer_type', 'celphone', 
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