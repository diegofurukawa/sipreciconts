# api/auth_custom/backends.py
from django.contrib.auth.backends import BaseBackend
from ..models.user import User

class CustomAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = User.objects.get(login=username, enabled=True)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None
        
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id, enabled=True)
        except User.DoesNotExist:
            return None