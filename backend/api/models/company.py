from django.db import models
from .base import BaseModel
from django.core.exceptions import ValidationError

# api/models/company.py
class Company(BaseModel):
    """
    Modelo de Empresa com company_id personalizável
    """
    name = models.CharField(
        'Nome da Empresa',
        max_length=100
    )
    document = models.CharField(
        'CNPJ',
        max_length=14,
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

    class Meta:
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'
        ordering = ['name']

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