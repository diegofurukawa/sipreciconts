# backend/api/serializers.py
from rest_framework import serializers
from ..models import Company

# Opção 1: Serializer explícito (mais verboso mas mais controlável)
class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'company_id', 'nick_name', 'full_name', 'type', 'document',
            'address', 'phone', 'description', 'enabled',
            'created', 'updated'
        ]
        read_only_fields = ['created', 'updated']

# Opção 2: Serializer com campos customizados adicionais
class CompanyDetailSerializer(serializers.ModelSerializer):
    company_id = serializers.IntegerField(source='company_id', read_only=True)  # Alias para id
    type_label = serializers.CharField(source='get_type_display', read_only=True)
    
    class Meta:
        model = Company
        fields = [
            'company_id',  # Usa um nome alternativo para o id
            'nick_name',
            'full_name',
            'type',
            'type_label',
            'document',
            'address',
            'phone',
            'description',
            'enabled',
            'created',
            'updated'
        ]
        #read_only_fields = ['company_id', 'created', 'updated']
        read_only_fields = ['created', 'updated']

# Opção 3: Serializer simplificado para listagens
class CompanyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['company_id', 'nick_name', 'type', 'document', 'phone']  # Apenas campos essenciais para listagem