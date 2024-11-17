from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.settings import api_settings
from django.utils import timezone
from datetime import datetime
from typing import Dict, Any, Optional

class TokenHandler:
    @staticmethod
    def generate_tokens(user) -> Dict[str, str]:
        """
        Gera tokens JWT com claims customizados para o usuário
        
        Args:
            user: Instância do modelo User

        Returns:
            Dict contendo os tokens de acesso e refresh

        Raises:
            ValueError: Se o usuário não estiver ativo
            Exception: Para outros erros durante a geração do token
        """
        try:
            if not user.is_active:
                raise ValueError('Usuário inativo não pode gerar tokens')

            refresh = RefreshToken.for_user(user)
            
            # Claims base para os tokens
            token_claims = {
                'user_id': user.id,
                'username': user.user_name,
                'email': user.email,
                'login': user.login,
                'type': user.type,
                'company_id': user.company.id if user.company else None,
                'company_name': user.company.name if user.company else None,
                'iat': timezone.now().timestamp(),
                'is_staff': user.is_staff,
                'is_active': user.is_active
            }

            # Adiciona claims ao refresh token
            for claim, value in token_claims.items():
                refresh[claim] = value

            # Adiciona claims ao access token
            for claim, value in token_claims.items():
                refresh.access_token[claim] = value

            # Adiciona claims específicos do access token
            refresh.access_token['token_type'] = 'access'
            refresh.access_token['exp'] = datetime.now() + api_settings.ACCESS_TOKEN_LIFETIME

            return {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'token_type': 'Bearer',
                'expires_in': int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds())
            }

        except ValueError as ve:
            raise ve
        except Exception as e:
            raise Exception(f'Erro ao gerar tokens: {str(e)}')

    @staticmethod
    def blacklist_token(token: str) -> None:
        """
        Adiciona um token à blacklist
        
        Args:
            token: Token JWT no formato string

        Raises:
            ValueError: Se o token for inválido
            Exception: Para outros erros durante o processo
        """
        try:
            if not token:
                raise ValueError('Token não fornecido')
                
            refresh = RefreshToken(token)
            refresh.blacklist()
            
        except ValueError as ve:
            raise ve
        except Exception as e:
            raise Exception(f'Erro ao invalidar token: {str(e)}')

    @staticmethod
    def validate_token(token: str) -> Dict[str, Any]:
        """
        Valida um token e retorna seus claims
        
        Args:
            token: Token JWT no formato string

        Returns:
            Dict contendo os claims do token

        Raises:
            ValueError: Se o token for inválido ou estiver na blacklist
            Exception: Para outros erros durante a validação
        """
        try:
            if not token:
                raise ValueError('Token não fornecido')

            token_obj = RefreshToken(token)
            
            # Verifica blacklist
            jti = token_obj.get('jti')
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                raise ValueError('Token está na blacklist')

            # Verifica expiração
            exp = token_obj.get('exp')
            if exp and datetime.fromtimestamp(exp) < datetime.now():
                raise ValueError('Token expirado')

            return {
                'valid': True,
                'claims': {
                    'user_id': token_obj.get('user_id'),
                    'login': token_obj.get('login'),
                    'type': token_obj.get('type'),
                    'company_id': token_obj.get('company_id'),
                    'exp': token_obj.get('exp')
                }
            }

        except ValueError as ve:
            raise ve
        except Exception as e:
            raise Exception(f'Erro ao validar token: {str(e)}')

    @staticmethod
    def refresh_tokens(refresh_token: str) -> Dict[str, str]:
        """
        Atualiza os tokens usando um refresh token
        
        Args:
            refresh_token: Refresh token no formato string

        Returns:
            Dict contendo os novos tokens

        Raises:
            ValueError: Se o refresh token for inválido
            Exception: Para outros erros durante o refresh
        """
        try:
            if not refresh_token:
                raise ValueError('Refresh token não fornecido')

            token = RefreshToken(refresh_token)
            
            # Verifica blacklist
            if BlacklistedToken.objects.filter(token__jti=token.get('jti')).exists():
                raise ValueError('Refresh token está na blacklist')

            return {
                'access': str(token.access_token),
                'refresh': str(token),
                'token_type': 'Bearer',
                'expires_in': int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds())
            }

        except ValueError as ve:
            raise ve
        except Exception as e:
            raise Exception(f'Erro ao atualizar tokens: {str(e)}')