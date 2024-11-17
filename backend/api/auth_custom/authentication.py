from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import get_user_model

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token['user_id']
            User = get_user_model()
            return User.objects.get(id=user_id, enabled=True)
        except User.DoesNotExist:
            return None