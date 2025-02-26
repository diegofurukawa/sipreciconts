from django.utils import timezone
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from typing import Dict, Any

from .handlers import TokenHandler
from ..serializers.user import UserSerializer
from ..models.usersession import UserSession
from ..serializers.usersession import UserSessionSerializer
from ..services.usersession import UserSessionService


User = get_user_model()


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    
    def get_token(self, user) -> RefreshToken:
        refresh = RefreshToken.for_user(user)
        
        # Adiciona claims customizados
        refresh['user_id'] = user.id
        refresh['login'] = user.login
        refresh['type'] = user.type
        refresh['company_id'] = user.company.company_id if user.company else None  # Mudou de .id para .company_id
        
        # Adiciona os mesmos claims ao token de acesso
        refresh.access_token['user_id'] = user.id
        refresh.access_token['login'] = user.login
        refresh.access_token['type'] = user.type
        refresh.access_token['company_id'] = user.company.company_id if user.company else None  # Mudou aqui também
        
        return refresh

    def post(self, request, *args, **kwargs):
        try:
            # Verifica credenciais
            login = request.data.get('login')
            password = request.data.get('password')

            if not login or not password:
                return Response(
                    {'error': 'Login e senha são obrigatórios'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                user = User.objects.get(login=login, enabled=True)
                if not user.check_password(password):
                    return Response(
                        {'error': 'Credenciais inválidas'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

                # Gera o token diretamente
                refresh = self.get_token(user)
                
                # Cria sessão
                session = UserSessionService.create_session(
                    user=user,
                    token=str(refresh.access_token),
                    refresh_token=str(refresh),
                    request=request
                )

                # Atualiza último login
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])

                # Resposta padronizada
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'session_id': str(session.session_id),
                    'user': {
                        'id': user.id,
                        'login': user.login,
                        'name': user.user_name if hasattr(user, 'user_name') else '',
                        'email': user.email,
                        'type': user.type,
                        'company_id': user.company.company_id if user.company else None,
                        'company_name': user.company.name if user.company else None,
                        'last_login': user.last_login.isoformat() if user.last_login else None
                    },
                    'expires_in': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                    'token_type': 'Bearer'
                })

            except User.DoesNotExist:
                return Response(
                    {'error': 'Usuário não encontrado'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Exception as e:
            print(f"Login error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class LogoutView(TokenObtainPairView):
    """
    View para logout e invalidação de tokens
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        try:
            auth_header = request.headers.get('Authorization', '')
            if not auth_header.startswith('Bearer '):
                return Response(
                    {'error': 'Token não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = auth_header.split(' ')[1]
            
            try:
                TokenHandler.blacklist_token(token)
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

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..serializers.user import UserSerializer
from ..services.usersession import UserSessionService

class ValidateTokenView(APIView):
    """
    View para validação de tokens JWT
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]  # Agora JWTAuthentication está importado corretamente

    def post(self, request, *args, **kwargs) -> Response:
        try:
            user = request.user
            if not user.enabled:
                return Response(
                    {'error': 'Usuário desativado'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            session_id = request.headers.get('X-Session-ID')
            if session_id:
                session = UserSessionService.get_active_session(session_id)
                if not session:
                    return Response(
                        {'error': 'Sessão inválida ou expirada'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

            user_data = UserSerializer(user).data
            
            return Response({
                'is_valid': True,
                'user': user_data,
                'token_type': 'Bearer'
            })

        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class TokenRefreshView(TokenObtainPairView):
    """
    View para renovação de tokens JWT
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs) -> Response:
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Token de refresh não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
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

class SessionView(TokenObtainPairView):
    """
    View para gerenciamento de sessões
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs) -> Response:
        token = getattr(request.auth, 'token', None)
        if not token:
            return Response(
                {"detail": "Token não encontrado"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

        session = UserSession.objects.create(
            user=request.user,
            company=request.user.company if hasattr(request.user, 'company') else None,
            token=str(token),
            refresh_token=request.data.get('refresh_token'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            ip_address=request.META.get('REMOTE_ADDR')
        )
        serializer = UserSessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EndSessionView(TokenObtainPairView):
    """
    View para encerrar sessões
    """
    permission_classes = [IsAuthenticated]

    def post(self, request) -> Response:
        token = getattr(request.auth, 'token', None)
        session = UserSession.objects.filter(
            user=request.user,
            token=token,
            is_active=True
        ).first()

        if not session:
            return Response(
                {"detail": "Sessão não encontrada"},
                status=status.HTTP_404_NOT_FOUND
            )

        session.end_session()
        return Response(status=status.HTTP_204_NO_CONTENT)