# api/models/tax.py

from django.db import models
from .base_model import BaseModel
from .types_model import TaxType, TaxGroup, CalcOperator

class Tax(BaseModel):
    description = models.CharField(
        'Descrição',
        max_length=100
    )
    type = models.CharField(
        'Tipo',
        max_length=10,
        choices=TaxType.choices
    )
    acronym = models.CharField(
        'Sigla',
        max_length=10
    )
    group = models.CharField(
        'Grupo',
        max_length=20,
        choices=TaxGroup.choices
    )
    calc_operator = models.CharField(
        'Operador de Cálculo',
        max_length=1,
        choices=CalcOperator.choices,
        default=CalcOperator.PERCENTAGE
    )
    value = models.DecimalField(
        'Valor',
        max_digits=10,
        decimal_places=4
    )

    class Meta:
        db_table = 'tax'
        verbose_name = 'Imposto'
        verbose_name_plural = 'Impostos'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['tax_id']),            
        ]

    def __str__(self):
        return f"{self.acronym} - {self.description}"