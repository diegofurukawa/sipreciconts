# api/auth_custom/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.utils import timezone
from .backends import CustomAuthBackend
from .handlers import TokenHandler
from ..serializers.user import UserSerializer

class LoginView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            login = request.data.get('username')
            password = request.data.get('password')

            if not login or not password:
                return Response(
                    {'error': 'Login e senha são obrigatórios'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Usa o backend customizado para autenticação
            auth_backend = CustomAuthBackend()
            user = auth_backend.authenticate(request, username=login, password=password)

            if not user:
                return Response(
                    {'error': 'Usuário não encontrado ou inativo'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Atualiza último login
            user.last_login = timezone.now()
            user.save(update_fields=['last_login'])

            try:
                # Usa o handler para gerar os tokens
                tokens = TokenHandler.generate_tokens(user)
                
                # Serializa os dados do usuário
                user_data = UserSerializer(user).data

                return Response({
                    **tokens,
                    'user': user_data
                })

            except Exception as token_error:
                print(f"Erro ao gerar token: {str(token_error)}")
                return Response(
                    {'error': 'Erro ao gerar token de acesso'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return Response(
                    {'error': 'Token não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = auth_header.split(' ')[1]
            
            try:
                # Usa o handler para fazer o blacklist do token
                TokenHandler.blacklist_token(token)
                
                return Response(
                    {'message': 'Logout realizado com sucesso'},
                    status=status.HTTP_200_OK
                )
            except Exception as token_error:
                print(f"Erro ao invalidar token: {str(token_error)}")
                return Response(
                    {'error': 'Erro ao invalidar token'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print(f"Logout error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ValidateTokenView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            if not user.enabled:
                raise ValueError('Usuário desativado')
                
            user_data = UserSerializer(user).data
            
            return Response({
                'is_valid': True,
                'user': user_data
            })
        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class TokenRefreshView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Token de refresh não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Usa o handler para gerar novo token de acesso
                tokens = TokenHandler.refresh_tokens(refresh_token)
                
                return Response(tokens)

            except Exception as token_error:
                print(f"Erro ao renovar token: {str(token_error)}")
                return Response(
                    {'error': 'Token de refresh inválido ou expirado'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Exception as e:
            print(f"Token refresh error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )