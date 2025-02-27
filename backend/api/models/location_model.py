# api/models/location.py
from django.db import models
from .base_model import BaseModel

class Location(BaseModel):
    name = models.CharField(max_length=100)
    address = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'location'
        ordering = ['name']
        verbose_name = 'Localização'
        verbose_name_plural = 'Localizações'
        indexes = [
            models.Index(fields=['company_id']),
            models.Index(fields=['location_id']),            
        ]