# backend/api/management/commands/test_login.py
import requests
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Test user login functionality'

    def handle(self, *args, **kwargs):
        try:
            # Backend test
            print("\nBACKEND TEST")
            print("-" * 20)
            try:
                user = User.objects.get(username='user_co001')
                print(f"User exists: {bool(user)}")
                print(f"Password valid: {user.check_password('dgo@2337')}")
            except User.DoesNotExist:
                print("User not found!")

            # Frontend test
            print("\nFRONTEND TEST")
            print("-" * 20)
            credentials = {
                'login': 'user_co001',
                'password': 'dgo@2337'
            }
            print(f"Testing with: {credentials}")

            response = requests.post(
                'http://localhost:8000/api/auth/login/',
                json=credentials,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Login successful: {response.status_code == 200}")
            
        except Exception as e:
            print(f"Error: {str(e)}")