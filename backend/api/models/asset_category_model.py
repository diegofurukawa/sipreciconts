# apps/assets/models/asset_category.py
from django.db import models
from .base_model import BaseModel
from .asset_group_model import AssetGroup

class AssetCategory(BaseModel):
    """
    Categorias para melhor organização dos ativos
    Ex: Equipamentos de TI, Móveis, Ferramentas, etc.
    """
    name = models.CharField('Nome', max_length=100)
    code = models.CharField('Código', max_length=20, unique=True)
    description = models.TextField('Descrição', blank=True, null=True)
    asset_group = models.ForeignKey(
        AssetGroup, 
        on_delete=models.PROTECT,
        related_name='categories',
        verbose_name='Grupo de Ativo'
    )

    def __str__(self):
        return f"{self.code} - {self.name}"

    class Meta:
        db_table = 'assetcategory'
        ordering = ['name']
        verbose_name = 'Categoria de Ativo'
        verbose_name_plural = 'Insumos - Categorias'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['code']),
        ]