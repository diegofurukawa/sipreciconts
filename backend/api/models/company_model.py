# api/models/company.py
from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from .base_model import BaseModel

class Company(BaseModel):
    """
    Modelo de Empresa com company_id personalizável e relacionamentos com usuários
    """
    name = models.CharField(
        'Nome da Empresa',
        max_length=100
    )
    document = models.CharField(
        'CNPJ',
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )
    phone = models.CharField(
        'Telefone',
        max_length=20,
        null=True,
        blank=True
    )
    email = models.EmailField(
        'Email',
        null=True,
        blank=True
    )
    address = models.TextField(
        'Endereço',
        null=True,
        blank=True
    )
    complement = models.TextField(
        'Complemento',
        null=True,
        blank=True
    )
    administrators = models.ManyToManyField(
        settings.AUTH_USER_MODEL,  # Única mudança aqui: usando settings.AUTH_USER_MODEL ao invés de importar User
        verbose_name='Administradores',
        related_name='administered_companies',
        blank=True
    )
    employees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,  # E aqui também
        verbose_name='Funcionários',
        related_name='employed_companies',
        blank=True
    )
    logo = models.ImageField(
        'Logo',
        upload_to='companies/logos/',
        null=True,
        blank=True
    )
    website = models.URLField(
        'Website',
        null=True,
        blank=True
    )
    description = models.TextField(
        'Descrição',
        null=True,
        blank=True
    )
    business_hours = models.JSONField(
        'Horário de Funcionamento',
        null=True,
        blank=True,
        help_text='Horários de funcionamento em formato JSON'
    )

    class Meta:
        db_table = 'company'
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'
        ordering = ['name']
        permissions = [
            ("can_manage_company", "Pode gerenciar empresa"),
            ("can_view_company_reports", "Pode ver relatórios da empresa"),
            ("can_manage_company_users", "Pode gerenciar usuários da empresa"),
        ]

    def __str__(self):
        return f"{self.company_id} - {self.name}"

    def clean(self):
        """
        Validações adicionais para o modelo Company
        """
        # Garante que company_id seja maiúsculo e sem espaços
        if self.company_id:
            self.company_id = self.company_id.upper().strip()
        
        # Validação customizada para company_id
        if not self.company_id:
            raise ValidationError({'company_id': 'O código da empresa é obrigatório'})
        
        if not self.company_id.isalnum():
            raise ValidationError({'company_id': 'O código deve conter apenas letras e números'})
        
        # Validação de documento (CNPJ)
        if self.document and not self._validate_document():
            raise ValidationError({'document': 'CNPJ inválido'})

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para garantir que as validações sejam executadas
        """
        self.clean()
        super().save(*args, **kwargs)

    def _validate_document(self):
        """
        Validação básica de CNPJ
        Pode ser expandido para uma validação mais completa
        """
        if self.document:
            # Remove caracteres não numéricos
            doc = ''.join(filter(str.isdigit, self.document))
            return len(doc) == 14
        return True

    def add_administrator(self, user):
        """
        Adiciona um administrador à empresa
        """
        if user not in self.administrators.all():
            self.administrators.add(user)

    def remove_administrator(self, user):
        """
        Remove um administrador da empresa
        """
        self.administrators.remove(user)

    def add_employee(self, user):
        """
        Adiciona um funcionário à empresa
        """
        if user not in self.employees.all():
            self.employees.add(user)

    def remove_employee(self, user):
        """
        Remove um funcionário da empresa
        """
        self.employees.remove(user)

    def is_administrator(self, user):
        """
        Verifica se o usuário é administrador da empresa
        """
        return user in self.administrators.all()

    def is_employee(self, user):
        """
        Verifica se o usuário é funcionário da empresa
        """
        return user in self.employees.all()

    def is_member(self, user):
        """
        Verifica se o usuário é membro da empresa (administrador ou funcionário)
        """
        return self.is_administrator(user) or self.is_employee(user)

    @property
    def total_members(self):
        """
        Retorna o total de membros da empresa
        """
        return self.administrators.count() + self.employees.count()

    def get_business_hours_display(self):
        """
        Retorna os horários de funcionamento em formato legível
        """
        if self.business_hours:
            # Implementar formatação dos horários
            return str(self.business_hours)
        return "Horário não definido"