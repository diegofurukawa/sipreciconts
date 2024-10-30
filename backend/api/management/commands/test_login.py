# backend/api/management/commands/test_login.py
import requests
from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Test user login functionality'

    def handle(self, *args, **kwargs):
        try:
            print("\nBACKEND TEST")
            print("-" * 20)
            
            with connection.cursor() as cursor:
                cursor.execute("PRAGMA table_info(user)")
                columns = [col[1] for col in cursor.fetchall()]
                print("Table columns:", columns)
                
                cursor.execute("SELECT * FROM user WHERE login = %s", ['user_co001'])
                row = cursor.fetchone()
                if row:
                    user_data = dict(zip(columns, row))
                    print(f"\nUser found:")
                    print(f"Company ID: {user_data.get('company_id')}")
                    print(f"Name: {user_data.get('user_name')}")                    
                    print(f"Login: {user_data.get('login')}")
                    print(f"Password (hashed): {user_data.get('password')[:30]}...")
                    
            print("\nFRONTEND TEST")
            print("-" * 20)
            credentials = {
                'login': 'user_co001',
                'password': 'dgo@2337'  # Use actual password, not hash
            }
            print(f"Testing with: {credentials}")

            response = requests.post(
                'http://localhost:8000/api/auth/login/',
                json=credentials,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status: {response.status_code}")
            print(f"Response: {response.json()}")
            
        except Exception as e:
            print(f"Error: {str(e)}")