# api/models/asset_location.py
from django.db import models
from .base_model import BaseModel
from .asset_model import Asset
from .location_model import Location

class AssetLocation(BaseModel):
    asset = models.ForeignKey(
        Asset, 
        on_delete=models.CASCADE,
        related_name='locations',
        verbose_name='Ativo'
    )
    location = models.ForeignKey(
        Location, 
        on_delete=models.CASCADE,
        related_name='assets',
        verbose_name='Localização'
    )
    start_date = models.DateTimeField(verbose_name='Data Início')
    end_date = models.DateTimeField(null=True, blank=True, verbose_name='Data Fim')
    current = models.BooleanField(default=True, verbose_name='Localização Atual')
    notes = models.TextField(null=True, blank=True, verbose_name='Observações')

    def __str__(self):
        return f"{self.asset} em {self.location}"

    class Meta:
        db_table = 'assetlocation'
        ordering = ['-start_date']
        verbose_name = 'Localização do Ativo'
        verbose_name_plural = 'Localizações dos Ativos'
        constraints = [
            models.UniqueConstraint(
                fields=['asset', 'location', 'start_date'],
                name='unique_asset_location_time'
            )
        ]