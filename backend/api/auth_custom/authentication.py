# api/auth_custom/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models.user import User

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        """
        Sobrescreve o método para usar nosso User model customizado
        """
        try:
            user_id = validated_token['user_id']
            return User.objects.get(id=user_id, enabled=True)
        except User.DoesNotExist:
            return None