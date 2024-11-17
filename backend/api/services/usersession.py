# services/usersession.py
import uuid
from django.utils import timezone
from ..models.usersession import UserSession
from typing import Optional

class UserSessionService:
    @staticmethod
    def create_session(user, token: str, refresh_token: str, request=None) -> UserSession:
        """
        Cria uma nova sessão para o usuário

        Args:
            user: Instância do modelo User
            token: Token de acesso JWT
            refresh_token: Token de refresh JWT
            request: Request do Django (opcional)

        Returns:
            UserSession: Nova sessão criada
        """
        try:
            company_id = user.company.company_id if user.company else None
            
            session = UserSession.objects.create(
                session_id=uuid.uuid4(),
                user=user,
                company_id=company_id,
                token=token,
                refresh_token=refresh_token,
                user_agent=request.META.get('HTTP_USER_AGENT') if request else None,
                ip_address=request.META.get('REMOTE_ADDR') if request else None,
                is_active=True
            )
            return session
            
        except Exception as e:
            print(f"Erro ao criar sessão: {str(e)}")
            raise

    @staticmethod
    def get_active_session(session_id: str) -> Optional[UserSession]:
        """
        Retorna uma sessão ativa pelo ID

        Args:
            session_id: ID da sessão a ser buscada

        Returns:
            UserSession ou None: Sessão encontrada ou None se não existir
        """
        try:
            return UserSession.objects.get(
                session_id=session_id,
                is_active=True,
                date_end__isnull=True
            )
        except UserSession.DoesNotExist:
            return None

    @staticmethod
    def end_all_user_sessions(user) -> None:
        """
        Encerra todas as sessões ativas do usuário

        Args:
            user: Instância do modelo User
        """
        try:
            UserSession.objects.filter(
                user=user,
                is_active=True
            ).update(
                is_active=False,
                date_end=timezone.now()
            )
        except Exception as e:
            print(f"Erro ao encerrar sessões: {str(e)}")
            raise