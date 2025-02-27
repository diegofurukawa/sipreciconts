# apps/assets/models/asset_group.py
from django.db import models
from .base_model import BaseModel

class AssetGroup(BaseModel):
    """
    Modelo para grupos de ativos (Fixed, Inventory, Consumable)
    """
    name = models.CharField('Nome', max_length=100)
    code = models.CharField('Código', max_length=20, unique=True)
    description = models.TextField('Descrição', blank=True, null=True)

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        db_table = 'assetgroup'
        ordering = ['name']
        verbose_name = 'Grupo de Ativo'
        verbose_name_plural = 'Insumos - Grupos'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['code']),
        ]