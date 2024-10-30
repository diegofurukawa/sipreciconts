# backend/api/views/login.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.db import connection

class LoginView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def get_tokens_for_user(self, user_data):
        refresh = RefreshToken()
        
        # Add custom claims to the token
        refresh['user_id'] = user_data['user_id']
        refresh['login'] = user_data['login']
        refresh['company_id'] = user_data['company_id']
        refresh['name'] = user_data['name']

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def post(self, request, *args, **kwargs):
        try:
            login = request.data.get('login')
            password = request.data.get('password')
            
            print(f"Login attempt for: {login}")
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT user_id, user_name, login, password, company_id, enabled
                    FROM user 
                    WHERE login = %s
                """, [login])
                
                row = cursor.fetchone()
                
                if row:
                    user_id, user_name, db_login, db_password, company_id, enabled = row
                    
                    print(f"Found user: {db_login}")
                    
                    if not enabled:
                        return Response(
                            {'error': 'Usuário desativado'},
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                    
                    if check_password(password, db_password):
                        print("Password matched")
                        user_data = {
                            'user_id': user_id,
                            'login': db_login,
                            'name': user_name,
                            'company_id': company_id
                        }
                        
                        # Update last_login
                        cursor.execute("""
                            UPDATE user 
                            SET last_login = CURRENT_TIMESTAMP 
                            WHERE login = %s
                        """, [login])
                        
                        # Get tokens
                        tokens = self.get_tokens_for_user(user_data)
                        
                        return Response({
                            'token': tokens['access'],
                            'user': user_data
                        })
                    else:
                        print("Password did not match")
                
                return Response(
                    {'error': 'Credenciais inválidas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
                
        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response(
                {'error': 'Erro interno do servidor'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )