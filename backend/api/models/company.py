from django.db import models
from .base import BaseModel

class Company(BaseModel):
    COMPANY_TYPES = (
        ('PF', 'Física'),
        ('PJ', 'Jurídica'),
    )

    nick_name = models.CharField(max_length=100)
    full_name = models.CharField(max_length=200, null=True, blank=True)
    type = models.CharField(max_length=2, choices=COMPANY_TYPES)
    document = models.CharField(max_length=20, null=True, blank=True, unique=True)
    address = models.TextField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    # enabled = models.BooleanField(default=True)
    # created = models.DateTimeField(auto_now_add=True)
    # updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'company'
        verbose_name = 'Company'
        verbose_name_plural = 'Empresas'
        ordering = ['nick_name']

    def __str__(self):
        return self.nick_name