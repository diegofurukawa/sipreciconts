# backend/api/models/supply.py
from django.db import models
from .base_model import BaseModel

class Supply(BaseModel):



    """Model for supplies/materials management"""
    
    class UnitMeasure(models.TextChoices):
        # About Quantity
        UNIT = 'UN', 'Unidade'
        
        # About Capacity
        KILOGRAM = 'KG', 'Kilograma' 
        MILLILITER = 'ML', 'Mililitro'        
        LITRE = 'L', 'Litro'
        METROCUBICO = 'M3', 'Metro Cubico'

        # About Distance
        METRO = 'M', 'Metro'
        KILOMETER = 'KM', 'Kilometros'
        
        # About Area        
        METROQUADRADO = 'M2', 'Metro Quadrado'

        # About Time
        DAY = 'DAY', 'Dia'  
        HOUR = 'HR', 'Hora'  
        MONTH = 'MON', 'Mês'
        YEAR = 'YEAR', 'Ano'

    class SupplyType(models.TextChoices):
        VEHICLE = 'VEI', 'Veículo'
        WEAPON = 'ARM', 'Armamento'
        MATERIAL = 'MAT', 'Material'
        UNIFORM = 'UNI', 'Uniforme'
        EQUIPMENT = 'EQUIP', 'Equipamento'
        SERVICE = 'SERV', 'Serviço'
        LABOUR = 'MAO', 'Mão de Obra'  


    name = models.CharField('Nome', max_length=200)
    nick_name = models.CharField('Apelido', max_length=100, null=True, blank=True)
    ean_code = models.CharField('Código EAN', max_length=13, null=True, blank=True, unique=True)
    description = models.TextField('Descrição', null=True, blank=True)
    unit_measure = models.CharField(
        'Unidade de Medida',
        max_length=5,
        choices=UnitMeasure.choices,
        default=UnitMeasure.UNIT
    )
    type = models.CharField(
        'Tipo',
        max_length=5,
        choices=SupplyType.choices,
        default=SupplyType.MATERIAL
    )

    class Meta:
        db_table = 'supplies'
        ordering = ['name']
        verbose_name = 'Supply'
        verbose_name_plural = 'Insumos - Itens'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['supply_id']),            
        ]
        

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"