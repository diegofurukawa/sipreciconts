# serializers/auth.py
from rest_framework import serializers

class LoginSerializer(serializers.Serializer):
    login = serializers.CharField()  # Mudamos de username para login
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        login = data.get('login')
        password = data.get('password')
        
        if not login or not password:
            raise serializers.ValidationError('Login e senha são obrigatórios')
            
        return data