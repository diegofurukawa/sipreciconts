# api/auth_custom/handlers.py

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from datetime import datetime

class TokenHandler:
    @staticmethod
    def generate_tokens(user):
        """
        Gera tokens JWT com claims customizados para o usuário
        """
        try:
            refresh = RefreshToken()
            
            # Claims customizados
            token_claims = {
                'user_id': user.id,
                'login': user.login,
                'type': user.type,
                'company_id': user.company_id,
                'iat': datetime.now()
            }

            # Adiciona claims ao refresh token
            for claim, value in token_claims.items():
                refresh[claim] = value

            # Adiciona claims ao access token
            for claim, value in token_claims.items():
                refresh.access_token[claim] = value

            return {
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
        except Exception as e:
            print(f"Erro ao gerar tokens: {str(e)}")
            raise

    @staticmethod
    def blacklist_token(token):
        """
        Adiciona um token à blacklist
        """
        try:
            token = RefreshToken(token)
            token.blacklist()
        except Exception as e:
            print(f"Erro ao invalidar token: {str(e)}")
            raise

    @staticmethod
    def validate_token(token):
        """
        Valida um token e verifica se está na blacklist
        """
        try:
            token = RefreshToken(token)
            
            # Verifica se o token está na blacklist
            jti = token.get('jti')
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                raise ValueError('Token está na blacklist')

            return True
        except Exception as e:
            print(f"Erro ao validar token: {str(e)}")
            raise