# api/models/customer.py

from django.db import models
from .base_model import BaseModel
from .types_model import CustomerType

class Customer(BaseModel):
    name = models.CharField('Nome', max_length=200)
    document = models.CharField(
        'Documento',
        max_length=20,
        unique=True,
        null=True,
        blank=True
    )
    customer_type = models.CharField(
        'Tipo de Cliente',
        max_length=50,
        choices=CustomerType.choices,
        default=CustomerType.INDIVIDUAL
    )
    celphone = models.CharField('Celular', max_length=20)
    email = models.EmailField(
        'E-mail',
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

    class Meta:
        db_table = 'customer'
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['customer_id']),            
        ]

    def __str__(self):
        return self.name