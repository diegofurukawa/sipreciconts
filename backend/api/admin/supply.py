
# backend/api/admin/supply.py
from django.contrib import admin
from ..models import Supply
from .base import BaseAdmin

@admin.register(Supply)
class SupplyAdmin(BaseAdmin):
    """Admin configuration for Supply model"""
    list_display = (
        'name', 
        'nick_name', 
        'ean_code', 
        'get_unit_measure_display', 
        'get_type_display',
        'enabled',
        'created',
        'updated'
    )
    list_filter = (
        'enabled',
        'type',
        'unit_measure',
        'created',
        'updated'
    )
    search_fields = (
        'name',
        'nick_name',
        'ean_code',
        'description'
    )
    fieldsets = (
        ('Informações Básicas', {
            'fields': (
                'name',
                'nick_name',
                'ean_code',
                'description'
            )
        }),
        ('Classificação', {
            'fields': (
                'unit_measure',
                'type'
            )
        }),
        ('Controle do Sistema', {
            'fields': (
                'enabled',
                'created',
                'updated'
            ),
            'classes': ('collapse',)
        })
    )
    
    def get_unit_measure_display(self, obj):
        return obj.get_unit_measure_display()
    get_unit_measure_display.short_description = 'Unidade de Medida'
    
    def get_type_display(self, obj):
        return obj.get_type_display()
    get_type_display.short_description = 'Tipo'
