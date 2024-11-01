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


class UserAuthSerializer(serializers.Serializer):
    """
    Serializer específico para autenticação, separado do serializer principal
    para manter as responsabilidades separadas
    """
    username = serializers.CharField(source='login')
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Valida as credenciais do usuário
        """
        login = data.get('login')
        password = data.get('password')

        if not login or not password:
            raise serializers.ValidationError({
                'error': 'Login e senha são obrigatórios.'
            })

        # Busca o usuário pelo login
        try:
            user = User.objects.get(login=login, enabled=True)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'error': 'Usuário não encontrado ou desativado.'
            })

        # Verifica a senha
        if not check_password(password, user.password):
            raise serializers.ValidationError({
                'error': 'Senha incorreta.'
            })

        # Adiciona o usuário validado aos dados
        data['user'] = user
        return data


class CompanySerializer(serializers.ModelSerializer):
    """
    Serializer para dados básicos da empresa, usado em conjunto com UserSerializer
    quando necessário
    """
    class Meta:
        model = Company
        fields = ['id', 'name']