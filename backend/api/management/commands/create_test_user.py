# backend/api/management/commands/create_test_user.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test user for login'

    def handle(self, *args, **kwargs):
        try:
            user = User.objects.create_user(
                username='user_co001',
                password='dgo@2337',
                email='test@example.com'
            )
            print(f"Test user created successfully:")
            print(f"Username: {user.username}")
            print(f"Password: dgo@2337")
        except Exception as e:
            print(f"Error creating user: {e}")