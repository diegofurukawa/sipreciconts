# apps/assets/models/asset_movement.py
from django.db import models
from .base import BaseModel
from .asset import Asset

class AssetMovement(BaseModel):
    """
    Registro de movimentações dos ativos
    """
    MOVEMENT_TYPES = [
        ('in', 'Entrada'),
        ('out', 'Saída'),
        ('transfer', 'Transferência'),
        ('adjustment', 'Ajuste'),
        ('maintenance', 'Manutenção'),
        ('return', 'Devolução'),
    ]

    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name='movements',
        verbose_name='Ativo'
    )
    movement_type = models.CharField(
        'Tipo de Movimento',
        max_length=20,
        choices=MOVEMENT_TYPES
    )
    quantity = models.DecimalField(
        'Quantidade',
        max_digits=15,
        decimal_places=3
    )
    from_location = models.CharField(
        'Origem',
        max_length=200,
        blank=True,
        null=True
    )
    to_location = models.CharField(
        'Destino',
        max_length=200,
        blank=True,
        null=True
    )
    reference_document = models.CharField(
        'Documento de Referência',
        max_length=100,
        blank=True,
        null=True
    )
    notes = models.TextField(
        'Observações',
        blank=True,
        null=True
    )
    movement_date = models.DateTimeField('Data do Movimento')
    created_by = models.ForeignKey(
        'auth.User',
        on_delete=models.PROTECT,
        verbose_name='Criado por'
    )

    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.asset.name} - {self.movement_date}"

    class Meta:
        ordering = ['-movement_date']
        verbose_name = 'Movimentação de Ativo'
        verbose_name_plural = 'Insumos - Movimentações'
        indexes = [
            models.Index(fields=['movement_date']),
            models.Index(fields=['movement_type']),
        ]