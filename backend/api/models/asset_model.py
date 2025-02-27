# apps/assets/models/asset.py
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from .base_model import BaseModel
from .asset_group_model import AssetGroup
from .asset_category_model import AssetCategory

class Asset(BaseModel):
    """
    Modelo principal para todos os tipos de ativos
    """
    STATUS_CHOICES = [
        ('available', 'Disponível'),
        ('in_use', 'Em Uso'),
        ('maintenance', 'Em Manutenção'),
        ('reserved', 'Reservado'),
        ('disposed', 'Descartado'),
        ('sold', 'Vendido'),
    ]

    # Campos básicos
    name = models.CharField('Nome', max_length=200)
    description = models.TextField('Descrição', blank=True, null=True)
    asset_group = models.ForeignKey(
        AssetGroup,
        on_delete=models.PROTECT,
        verbose_name='Grupo'
    )
    category = models.ForeignKey(
        AssetCategory,
        on_delete=models.PROTECT,
        verbose_name='Categoria'
    )
    
    # Identificação
    asset_code = models.CharField(
        'Código do Ativo', 
        max_length=50, 
        unique=True
    )
    patrimony_code = models.CharField(
        'Código Patrimonial',
        max_length=50,
        blank=True,
        null=True,
        unique=True
    )
    serial_number = models.CharField(
        'Número de Série',
        max_length=100,
        blank=True,
        null=True
    )
    
    # Informações de estoque
    quantity = models.DecimalField(
        'Quantidade',
        max_digits=15,
        decimal_places=3,
        validators=[MinValueValidator(Decimal('0.000'))],
        default=0
    )
    minimum_quantity = models.DecimalField(
        'Quantidade Mínima',
        max_digits=15,
        decimal_places=3,
        validators=[MinValueValidator(Decimal('0.000'))],
        default=0
    )
    unit_measure = models.CharField(
        'Unidade de Medida',
        max_length=20
    )
    
    # Informações financeiras
    purchase_value = models.DecimalField(
        'Valor de Compra',
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        null=True,
        blank=True
    )
    current_value = models.DecimalField(
        'Valor Atual',
        max_digits=15,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        null=True,
        blank=True
    )
    
    # Status e controle
    status = models.CharField(
        'Status',
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )
    acquisition_date = models.DateField(
        'Data de Aquisição',
        null=True,
        blank=True
    )
    warranty_expiration = models.DateField(
        'Vencimento da Garantia',
        null=True,
        blank=True
    )
    next_maintenance = models.DateField(
        'Próxima Manutenção',
        null=True,
        blank=True
    )
    location = models.CharField(
        'Localização',
        max_length=200,
        blank=True,
        null=True
    )
    
    notes = models.TextField('Observações', blank=True, null=True)

    def __str__(self):
        return f"{self.asset_code} - {self.name}"

    class Meta:
        db_table = 'asset'
        ordering = ['name']
        verbose_name = 'Ativo'
        verbose_name_plural = 'Insumos'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['asset_code']),
            models.Index(fields=['patrimony_code']),
            models.Index(fields=['status']),
        ]