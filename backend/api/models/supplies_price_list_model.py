# api/models/supplies_price_list_model.py
from django.db import models
from .base_model import BaseModel
from .supply_model import Supply
from .tax_model import Tax

class SuppliesPriceList(BaseModel):
    """
    Model for supplies price lists management.
    Stores pricing information for supplies with optional tax references.
    """
    # O campo ID primário será criado automaticamente pela metaclasse como 'suppliespricelistmodel_id'
    # ou simplesmente 'supplies_price_list_id', dependendo da implementação

    supply = models.ForeignKey(
        Supply,
        on_delete=models.PROTECT,
        related_name='price_lists',
        verbose_name='Insumo'
    )
    tax = models.ForeignKey(
        Tax,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='supply_prices',
        verbose_name='Imposto'
    )
    value = models.DecimalField(
        'Valor',
        max_digits=15,
        decimal_places=4
    )
    sequence = models.IntegerField(
        'Sequência',
        default=1,
        help_text='Ordem de prioridade na listagem'
    )

    class Meta:
        db_table = 'supplies_price_list'
        verbose_name = 'Lista de Preços de Insumos'
        verbose_name_plural = 'Listas de Preços de Insumos'
        ordering = ['sequence', 'supply__name']
        constraints = [
            models.UniqueConstraint(
                fields=['supply', 'tax', 'company'],
                name='unique_supply_tax_per_company'
            )
        ]
        indexes = [
            models.Index(fields=['company_id']),
            # Remova ou corrija esta linha:
            # models.Index(fields=['supplies_price_list_id']),
            models.Index(fields=['supply', 'tax']),
        ]

    def __str__(self):
        tax_info = f" + {self.tax.acronym}" if self.tax else ""
        return f"{self.supply.name}{tax_info}: {self.value}"