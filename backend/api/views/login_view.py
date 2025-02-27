from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from ..auth_custom.handlers_admin import TokenHandler
from ..serializers.user_serializer import UserSerializer
from ..models.user_model import User
from ..services.usersession_service import UserSessionService
from typing import Dict, Any

class LoginView(TokenObtainPairView):
    """
    View para autenticação de usuários e geração de tokens JWT
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs) -> Response:
        try:
            # Tenta autenticar usando TokenObtainPairView
            response = super().post(request, *args, **kwargs)
            
            if response.status_code == 200:
                # Cria sessão do usuário
                session = UserSessionService.create_session(
                    user=request.user,
                    company=request.user.company,
                    token=response.data['access'],
                    refresh_token=response.data['refresh'],
                    request=request
                )

                # Serializa dados do usuário
                user_data = UserSerializer(request.user).data
                
                # Atualiza último login
                request.user.last_login = timezone.now()
                request.user.save(update_fields=['last_login'])
                
                # Atualiza resposta com dados adicionais
                response.data.update({
                    'session_id': str(session.session_id),
                    'user': user_data,
                    'expires_in': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
                })
            
            return response

        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response(
                {'error': 'Erro durante o processo de login'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LogoutView(APIView):
    """
    View para logout e invalidação de tokens
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        try:
            # Tenta obter o token do header Authorization
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return Response(
                    {'error': 'Token não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = auth_header.split(' ')[1]
            
            try:
                # Invalida o token usando o TokenHandler
                TokenHandler.blacklist_token(token)
                
                # Encerra a sessão ativa do usuário
                UserSessionService.end_all_user_sessions(request.user)
                
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
    """
    View para validação de tokens JWT
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        try:
            user = request.user
            if not user.enabled:
                return Response(
                    {'error': 'Usuário desativado'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Obtém os dados do usuário
            user_data = UserSerializer(user).data
            
            # Valida a sessão ativa
            session = UserSessionService.get_active_session(
                request.headers.get('X-Session-ID')
            )
            
            if not session:
                return Response(
                    {'error': 'Sessão inválida ou expirada'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            return Response({
                'is_valid': True,
                'user': user_data,
                'session': {
                    'id': str(session.session_id),
                    'last_activity': session.last_activity
                }
            })

        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class TokenRefreshView(APIView):
    """
    View para renovação de tokens JWT
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs) -> Response:
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Gera novos tokens usando o TokenHandler
            new_tokens = TokenHandler.refresh_tokens(refresh_token)
            
            return Response(new_tokens)

        except TokenError:
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