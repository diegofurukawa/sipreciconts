# api/admin/supplies_price_list_admin.py
from django.contrib import admin
from ..models import SuppliesPriceList
from .base_admin import BaseAdmin

@admin.register(SuppliesPriceList)
class SuppliesPriceListAdmin(BaseAdmin):
    """Admin configuration for SuppliesPriceList model"""
    list_display = (
        'get_supply_name',
        'get_tax_acronym',
        'value',
        'sequence',
        'enabled',
        'created',
        'updated'
    )
    list_filter = (
        'enabled',
        'created',
        'updated'
    )
    search_fields = (
        'supply__name',
        'supply__supply_id',
        'tax__acronym',
        'tax__description'
    )
    autocomplete_fields = ['supply', 'tax']
    list_select_related = ('supply', 'tax')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': (
                'supply',
                'tax',
                'value',
                'sequence'
            )
        }),
        ('Controle do Sistema', {
            'fields': (
                'company',
                'enabled',
                'created',
                'updated'
            ),
            'classes': ('collapse',)
        })
    )
    
    def get_supply_name(self, obj):
        """Returns supply name for display in list view"""
        return obj.supply.name
    get_supply_name.short_description = 'Insumo'
    get_supply_name.admin_order_field = 'supply__name'
    
    def get_tax_acronym(self, obj):
        """Returns tax acronym for display in list view"""
        return obj.tax.acronym if obj.tax else '-'
    get_tax_acronym.short_description = 'Imposto'
    get_tax_acronym.admin_order_field = 'tax__acronym'
    
    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        """Limit options to the current company"""
        if db_field.name == "supply" and request.user.company:
            kwargs["queryset"] = db_field.related_model.objects.filter(
                company=request.user.company, enabled=True
            )
        if db_field.name == "tax" and request.user.company:
            kwargs["queryset"] = db_field.related_model.objects.filter(
                company=request.user.company, enabled=True
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)