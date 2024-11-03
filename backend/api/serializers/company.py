# api/serializers/company.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from ..models import Company

User = get_user_model()

class UserMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']

class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer base para Company
    """
    class Meta:
        model = Company
        fields = [
            'id',
            'company_id',
            'name',
            'document',
            'phone',
            'email',
            'address',
            'enabled',
            'created',
            'updated'
        ]
        read_only_fields = ['created', 'updated']

class CompanyListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listagem de empresas
    """
    administrators_count = serializers.SerializerMethodField()
    employees_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id',
            'company_id',
            'name',
            'document',
            'phone',
            'email',
            'administrators_count',
            'employees_count',
            'enabled'
        ]

    def get_administrators_count(self, obj):
        return obj.administrators.count()

    def get_employees_count(self, obj):
        return obj.employees.count()

class CompanyDetailSerializer(serializers.ModelSerializer):
    """
    Serializer completo para detalhes da empresa
    """
    administrators = UserMinimalSerializer(many=True, read_only=True)
    employees = UserMinimalSerializer(many=True, read_only=True)
    business_hours_display = serializers.CharField(
        source='get_business_hours_display',
        read_only=True
    )
    total_members = serializers.IntegerField(read_only=True)

    class Meta:
        model = Company
        fields = [
            'id',
            'company_id',
            'name',
            'document',
            'phone',
            'email',
            'address',
            'complement',
            'website',
            'description',
            'logo',
            'business_hours',
            'business_hours_display',
            'administrators',
            'employees',
            'total_members',
            'enabled',
            'created',
            'updated'
        ]
        read_only_fields = ['created', 'updated', 'total_members']

    def validate_company_id(self, value):
        """
        Validação do company_id
        """
        if value:
            value = value.upper().strip()
            if not value.isalnum():
                raise serializers.ValidationError(
                    'O código deve conter apenas letras e números'
                )
        return value

    def validate_document(self, value):
        """
        Validação básica do CNPJ
        """
        if value:
            # Remove caracteres não numéricos
            doc = ''.join(filter(str.isdigit, value))
            if len(doc) != 14:
                raise serializers.ValidationError('CNPJ inválido')
        return value

class CompanyCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para criação de empresa
    """
    class Meta:
        model = Company
        fields = [
            'company_id',
            'name',
            'document',
            'phone',
            'email',
            'address',
            'complement',
            'website',
            'description',
            'business_hours',
            'logo'
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        company = Company.objects.create(**validated_data)
        company.administrators.add(user)
        return company

class CompanyUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para atualização de empresa
    """
    class Meta:
        model = Company
        fields = [
            'name',
            'document',
            'phone',
            'email',
            'address',
            'complement',
            'website',
            'description',
            'business_hours',
            'logo'
        ]

class CompanyMemberManagementSerializer(serializers.Serializer):
    """
    Serializer para gerenciamento de membros da empresa
    """
    user_id = serializers.IntegerField(required=True)
    role = serializers.ChoiceField(choices=['administrator', 'employee'], required=True)

    def validate_user_id(self, value):
        try:
            User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError('Usuário não encontrado')
        return value

class CompanyBasicSerializer(serializers.ModelSerializer):
    """
    Serializer básico para referências simples à empresa
    """
    class Meta:
        model = Company
        fields = ['id', 'company_id', 'name', 'document']