# backend/api/models/asset_movement.py
from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .base_model import BaseModel
from .location_model import Location


class AssetMovement(BaseModel):
    """
    Modelo para controle de movimentação de ativos
    """
    MOVEMENT_TYPES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
        ('transferencia', 'Transferência'),
    ]

    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('aprovado', 'Aprovado'),
        ('rejeitado', 'Rejeitado'),
        ('cancelado', 'Cancelado'),
    ]

    # Campos básicos
    movement_type = models.CharField(
        max_length=20,
        choices=MOVEMENT_TYPES,
        verbose_name='Tipo de Movimentação'
    )
    
    movement_date = models.DateField(  # Renomeado de 'date' para 'movement_date'
        verbose_name='Data da Movimentação'
    )
    
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Quantidade'
    )
    
    unit_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Valor Unitário'
    )
    
    total_value = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name='Valor Total',
        editable=False
    )

    description = models.TextField(
        verbose_name='Descrição',
        blank=True,
        null=True
    )

    document_number = models.CharField(
        max_length=50,
        verbose_name='Número do Documento',
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pendente',
        verbose_name='Status'
    )

    # Relacionamentos
    asset = models.ForeignKey(
        'Asset',
        on_delete=models.PROTECT,
        verbose_name='Ativo',
        related_name='movements'
    )

    from_location = models.ForeignKey(  # Renomeado de 'origin_location' para 'from_location'
        Location,
        on_delete=models.PROTECT,
        verbose_name='Local de Origem',
        related_name='movements_as_origin'
    )

    to_location = models.ForeignKey(  # Renomeado de 'destination_location' para 'to_location'
        Location,
        on_delete=models.PROTECT,
        verbose_name='Local de Destino',
        related_name='movements_as_destination',
        null=True,
        blank=True
    )

    # # Campos de auditoria
    # created = models.DateTimeField(  # Renomeado de 'created_at' para 'created'
    #     auto_now_add=True,
    #     verbose_name='Criado em'
    # )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        verbose_name='Criado por',
        related_name='created_asset_movements'
    )

    # updated = models.DateTimeField(  # Renomeado de 'updated_at' para 'updated'
    #     auto_now=True,
    #     verbose_name='Atualizado em'
    # )

    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        verbose_name='Atualizado por',
        related_name='updated_asset_movements',
        null=True,
        blank=True
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        verbose_name='Aprovado por',
        related_name='approved_asset_movements',
        null=True,
        blank=True
    )

    approved_at = models.DateTimeField(
        verbose_name='Aprovado em',
        null=True,
        blank=True
    )

    # enabled = models.BooleanField(
    #     default=True,
    #     verbose_name='Ativo'
    # )

    class Meta:
        db_table = 'assetmovement'
        verbose_name = 'Movimentação de Ativo'
        verbose_name_plural = 'Movimentações de Ativos'
        ordering = ['-movement_date', '-created']
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['movement_date', 'movement_type']),
            models.Index(fields=['created']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.asset} - {self.movement_date}"

    def clean(self):
        if self.movement_type == 'transferencia' and not self.to_location:
            raise ValidationError({
                'to_location': _('Local de destino é obrigatório para transferências')
            })

        if self.from_location == self.to_location:
            raise ValidationError({
                'to_location': _('Local de destino deve ser diferente do local de origem')
            })

        if self.quantity <= 0:
            raise ValidationError({
                'quantity': _('Quantidade deve ser maior que zero')
            })

        if self.unit_value < 0:
            raise ValidationError({
                'unit_value': _('Valor unitário não pode ser negativo')
            })

    def save(self, *args, **kwargs):
        self.total_value = self.quantity * self.unit_value
        self.full_clean()
        super().save(*args, **kwargs)