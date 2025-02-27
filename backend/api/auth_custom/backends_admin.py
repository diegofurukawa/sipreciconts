# api/auth_custom/backends.py
from django.contrib.auth.backends import BaseBackend
from ..models.user_model import User

class CustomAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            # MODIFICAR PARA:
            # Usar o parâmetro username para compatibilidade, mas buscar pelo campo login
            login_value = username  # Aceita username como parâmetro mas busca por login
            user = User.objects.get(login=login_value, enabled=True)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id, enabled=True)
        except User.DoesNotExist:
            return None