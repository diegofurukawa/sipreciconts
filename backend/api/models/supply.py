# backend/api/models/supply.py
from django.db import models
from .base import BaseModel

class Supply(BaseModel):
    """Model for supplies/materials management"""
    
    class UnitMeasure(models.TextChoices):
        UNIT = 'UN', 'Unidade'
        KILOGRAM = 'KG', 'Kilograma' 
        MILLILITER = 'ML', 'Mililitro'

    class SupplyType(models.TextChoices):
        VEHICLE = 'VEI', 'Veículo'
        WEAPON = 'ARM', 'Armamento'
        MATERIAL = 'MAT', 'Material'
        UNIFORM = 'UNI', 'Uniforme'

    name = models.CharField('Nome', max_length=200)
    nick_name = models.CharField('Apelido', max_length=100, null=True, blank=True)
    ean_code = models.CharField('Código EAN', max_length=13, null=True, blank=True, unique=True)
    description = models.TextField('Descrição', null=True, blank=True)
    unit_measure = models.CharField(
        'Unidade de Medida',
        max_length=2,
        choices=UnitMeasure.choices,
        default=UnitMeasure.UNIT
    )
    type = models.CharField(
        'Tipo',
        max_length=3,
        choices=SupplyType.choices,
        default=SupplyType.MATERIAL
    )

    class Meta:
        ordering = ['name']
        verbose_name = 'Supply'
        verbose_name_plural = 'Supplies'
        db_table = 'supplies'

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"