# sessions/services.py
import uuid
from django.utils import timezone
from ..models.usersession import UserSession

class UserSessionService:
    @staticmethod
    def create_session(user, company, token, refresh_token, request=None):
        """Cria uma nova sessão para o usuário"""
        session = UserSession.objects.create(
            session_id=uuid.uuid4(),
            user=user,
            company=company,
            token=token,
            refresh_token=refresh_token,
            user_agent=request.META.get('HTTP_USER_AGENT') if request else None,
            ip_address=request.META.get('REMOTE_ADDR') if request else None
        )
        return session

    @staticmethod
    def get_active_session(session_id):
        """Retorna uma sessão ativa pelo ID"""
        try:
            return UserSession.objects.get(
                session_id=session_id,
                is_active=True,
                date_end__isnull=True
            )
        except UserSession.DoesNotExist:
            return None

    @staticmethod
    def end_all_user_sessions(user):
        """Encerra todas as sessões ativas do usuário"""
        UserSession.objects.filter(
            user=user,
            is_active=True
        ).update(
            is_active=False,
            date_end=timezone.now()
        )