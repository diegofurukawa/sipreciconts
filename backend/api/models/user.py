from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
from .company import Company

class UserManager(BaseUserManager):
    """
    Manager customizado para o modelo User
    """
    def create_user(self, login, user_name, email, password=None, **extra_fields):
        if not login:
            raise ValueError('O campo login é obrigatório')
        if not email:
            raise ValueError('O campo email é obrigatório')
        if not user_name:
            raise ValueError('O campo user_name é obrigatório')

        user = self.model(
            login=login,
            user_name=user_name,
            email=self.normalize_email(email),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login, user_name, email, password=None, **extra_fields):
        extra_fields.setdefault('type', 'Admin')
        extra_fields.setdefault('enabled', True)
        
        return self.create_user(
            login=login,
            user_name=user_name,
            email=email,
            password=password,
            **extra_fields
        )

class User(AbstractBaseUser):
    """
    Modelo de usuário customizado
    """
    TYPE_CHOICES = [
        ('Admin', 'Administrador'),
        ('Usuario', 'Usuário'),
    ]

    id = models.BigAutoField(
        primary_key=True,
        verbose_name='ID'
    )

    user_name = models.CharField(
        verbose_name='Nome do Usuário',
        max_length=255,
        help_text='Nome completo do usuário'
    )

    email = models.EmailField(
        verbose_name='E-mail',
        help_text='E-mail do usuário',
        unique=True
    )

    login = models.CharField(
        verbose_name='Login',
        max_length=50,
        help_text='Login de acesso do usuário',
        unique=True
    )

    password = models.CharField(
        verbose_name='Senha',
        max_length=128
    )

    type = models.CharField(
        verbose_name='Tipo',
        max_length=10,
        choices=TYPE_CHOICES,
        default='Usuario',
        help_text='Tipo de usuário (Administrador ou Usuário)'
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.PROTECT,
        related_name='users',
        verbose_name='Empresa'
    )

    # Campos do BaseModel
    created = models.DateTimeField(
        verbose_name='Criado em',
        auto_now_add=True
    )
    
    updated = models.DateTimeField(
        verbose_name='Atualizado em',
        auto_now=True
    )
    
    enabled = models.BooleanField(
        verbose_name='Ativo',
        default=True
    )

    last_login = models.DateTimeField(
        verbose_name='Último Login',
        null=True,
        blank=True,
        help_text='Data e hora do último acesso'
    )

    objects = UserManager()

    # Campos necessários para AbstractBaseUser
    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['user_name', 'email']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._password = None
        self._password_changed = False

    def set_password(self, raw_password):
        self._password = raw_password
        self._password_changed = True

    def save(self, *args, **kwargs):
        if self._password_changed:
            self.password = make_password(self._password)
            self._password_changed = False
        super().save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    @property
    def is_staff(self):
        return self.type == 'Admin'

    @property
    def is_active(self):
        return self.enabled

    @property
    def is_superuser(self):
        return self.type == 'Admin'

    def has_perm(self, perm, obj=None):
        return True if self.is_staff else False

    def has_module_perms(self, app_label):
        return True if self.is_staff else False

    def get_full_name(self):
        return self.user_name

    def get_short_name(self):
        return self.user_name.split()[0] if self.user_name else self.login

    def __str__(self):
        return f"{self.user_name} ({self.login})"

    class Meta:
        db_table = 'user'
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['user_name']
        indexes = [
            models.Index(fields=['company']),
            models.Index(fields=['email']),
            models.Index(fields=['login']),
        ]