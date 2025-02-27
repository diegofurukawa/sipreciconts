# api/models.py
from .user_model import User
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class UserSession(models.Model):
    session_id = models.UUIDField(unique=True, editable=False, default=uuid.uuid4)
    user = models.ForeignKey(
        User, 
        on_delete=models.PROTECT,
        related_name='users',
        verbose_name='sessao de usuarios'
    )
    # user = models.ForeignKey(
    #     settings.AUTH_USER_MODEL,
    #     on_delete=models.CASCADE,
    #     related_name='sessions'
    # )
    company_id = models.CharField(  # Mudando de IntegerField para CharField
        max_length=30,
        null=True, 
        blank=True
    )
    token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255, null=True, blank=True)  # Permitindo null
    date_start = models.DateTimeField(auto_now_add=True)
    date_end = models.DateTimeField(null=True, blank=True)
    expired_token = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    user_agent = models.CharField(max_length=255, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_sessions'
        ordering = ['-date_start']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['session_id']),
        ]

    def __str__(self):
        # return f"Session {self.session_id}"
        return f"Session {self.session_id} - {self.user.username}"

    def end_session(self):
        """Finaliza a sessão atual"""
        self.is_active = False
        self.date_end = timezone.now()
        self.save()

    def update_activity(self):
        """Atualiza o timestamp da última atividade"""
        self.last_activity = timezone.now()
        self.save()

    def update_tokens(self, token, refresh_token, expired_token=None):
        """Atualiza os tokens da sessão"""
        self.token = token
        self.refresh_token = refresh_token
        self.expired_token = expired_token
        self.save()