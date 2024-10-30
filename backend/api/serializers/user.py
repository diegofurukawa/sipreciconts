# backend/api/serializers/user.py
from rest_framework import serializers
from django.contrib.auth.hashers import make_password, check_password
from ..models.user import User
from ..models.company import Company

class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(write_only=True, required=True)
    company_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'user_name', 'email', 'login', 'password',
            'password_confirm', 'type', 'company', 'company_name',
            'enabled', 'created', 'updated', 'last_login'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'created': {'read_only': True},
            'updated': {'read_only': True},
            'last_login': {'read_only': True},
            'enabled': {'read_only': True}
        }

    def get_company_name(self, obj):
        return obj.company.name if obj.company else None

    def validate(self, data):
        """
        Validação dos dados
        """
        # Validação de senha na criação
        if self.instance is None:  # Create
            if not data.get('company'):
                raise serializers.ValidationError({
                    'company': 'A empresa é obrigatória.'
                })
            
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError({
                    'password_confirm': 'As senhas não conferem.'
                })

        # Validação de senha na atualização (se fornecida)
        elif 'password' in data:
            if 'password_confirm' not in data:
                raise serializers.ValidationError({
                    'password_confirm': 'Confirmação de senha é necessária.'
                })
            if data['password'] != data['password_confirm']:
                raise serializers.ValidationError({
                    'password_confirm': 'As senhas não conferem.'
                })

        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop('password_confirm', None)
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)