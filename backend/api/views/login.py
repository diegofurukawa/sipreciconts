from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from django.utils import timezone
from django.conf import settings
from ..serializers.user import UserSerializer
from ..models.user import User
from rest_framework.permissions import AllowAny
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView
from ..services.usersession import UserSessionService


# class LoginView(APIView):
#     permission_classes = []

#     def post(self, request, *args, **kwargs):
#         try:
#             login = request.data.get('username')
#             password = request.data.get('password')

#             if not login or not password:
#                 return Response(
#                     {'error': 'Login e senha são obrigatórios'},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )

#             try:
#                 user = User.objects.get(login=login, enabled=True)
#             except User.DoesNotExist:
#                 return Response(
#                     {'error': 'Usuário não encontrado ou inativo'},
#                     status=status.HTTP_401_UNAUTHORIZED
#                 )

#             if not user.check_password(password):
#                 return Response(
#                     {'error': 'Senha incorreta'},
#                     status=status.HTTP_401_UNAUTHORIZED
#                 )

#             # Atualiza último login
#             user.last_login = timezone.now()
#             user.save(update_fields=['last_login'])

#             try:
#                 # Gera os tokens JWT
#                 refresh = RefreshToken.for_user(user)
#                 access_token = refresh.access_token

#                 # Serializa os dados do usuário
#                 user_data = UserSerializer(user).data

#                 return Response({
#                     'access': str(access_token),
#                     'refresh': str(refresh),
#                     'user': user_data
#                 })

#             except Exception as token_error:
#                 print(f"Erro ao gerar token: {str(token_error)}")
#                 return Response(
#                     {'error': 'Erro ao gerar token de acesso'},
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR
#                 )

#         except Exception as e:
#             print(f"Login error: {str(e)}")
#             return Response(
#                 {'error': str(e)},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR
#             )

class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Criar sessão do usuário
            session = UserSessionService.create_session(
                user=request.user,
                company_id=request.user.company_id,
                token=response.data['access'],
                refresh_token=response.data['refresh'],
                request=request
            )
            
            # Adicionar session_id e dados adicionais à resposta
            response.data.update({
                'session_id': str(session.session_id),
                'user': {
                    'id': request.user.id,
                    'username': request.user.username,
                    'company_id': request.user.company_id,
                    # Adicione outros campos do usuário conforme necessário
                }
            })
        
        return response
    
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response(status=status.HTTP_200_OK)
            except Exception as e:
                return Response(
                    {'error': 'Token inválido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            print(f"Logout error: {str(e)}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
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
                token = RefreshToken(token)
                token.blacklist()
                
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
    permission_classes = [AllowAny]  # Importante para validação

    def post(self, request, *args, **kwargs):
        try:
            token = request.data.get('token')
            if not token:
                return Response(
                    {'error': 'Token não fornecido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Valida o token primeiro
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                
                # Busca o usuário após validar o token
                try:
                    user = User.objects.get(id=user_id)
                    if not user.enabled:
                        return Response(
                            {'error': 'Usuário desativado'},
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                    
                    user_data = UserSerializer(user).data
                    return Response({
                        'valid': True,
                        'user': user_data
                    })
                    
                except ObjectDoesNotExist:
                    return Response(
                        {'error': 'Usuário não encontrado'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
                    
            except TokenError:
                return Response(
                    {'error': 'Token inválido'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        except Exception as e:
            print(f"Token validation error: {str(e)}")
            return Response(
                {'error': 'Erro na validação do token'},
                status=status.HTTP_400_BAD_REQUEST
            )
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