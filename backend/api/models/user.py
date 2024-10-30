# backend/api/models/user.py
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password
from .base import BaseModel

class User(BaseModel):
    """
    Modelo de usuário para API
    Herda de BaseModel para manter o padrão do projeto
    """
    
    TYPE_CHOICES = [
        ('Admin', 'Administrador'),
        ('Usuario', 'Usuário'),
    ]

    user_name = models.CharField(
        verbose_name='Nome do Usuário',
        max_length=255,
        help_text='Nome completo do usuário'
    )

    email = models.EmailField(
        verbose_name='E-mail',
        help_text='E-mail do usuário (será usado para login)'
    )

    login = models.CharField(
        verbose_name='Login',
        max_length=50,
        help_text='Login de acesso do usuário'
    )

    password = models.CharField(
        verbose_name='Senha',
        max_length=128,
        help_text='Senha de acesso do usuário'
    )

    type = models.CharField(
        verbose_name='Tipo',
        max_length=10,
        choices=TYPE_CHOICES,
        default='Usuario',
        help_text='Tipo de usuário (Administrador ou Usuário)'
    )

    last_login = models.DateTimeField(
        verbose_name='Último Login',
        null=True,
        blank=True,
        help_text='Data e hora do último acesso'
    )

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para garantir que a senha seja sempre criptografada
        """
        if self._state.adding or self._password_changed:
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'user'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['user_name']
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['email']),
            models.Index(fields=['login']),
        ]