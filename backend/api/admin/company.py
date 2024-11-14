# api/admin/company.py
from django.contrib import admin
from ..models import Company
from ..forms.company import CompanyForm


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    form = CompanyForm

    list_display = [
        'company_id',
        'name',
        'document',
        'phone',
        'email',
        'enabled',
        'created_at_display'
    ]

    list_filter = [
        'enabled',
        'created'
    ]

    search_fields = [
        'company_id',
        'name',
        'document',
        'email'
    ]

    ordering = ['company_id']

    readonly_fields = (
        'created',
        'updated'
    )

    fieldsets = (
        ('Identificação', {
            'fields': ('company_id', 'name', 'document')
        }),
        ('Contato', {
            'fields': ('phone', 'email')
        }),
        ('Endereço', {
            'fields': ('address',),
            'classes': ('collapse',)
        }),
        ('Informações do Sistema', {
            'fields': ('enabled', 'created', 'updated'),
            'classes': ('collapse',)
        }),
    )

    def created_at_display(self, obj):
        """Formata a data de criação para exibição"""
        if obj.created:
            return obj.created.strftime('%d/%m/%Y %H:%M')
        return '-'

    created_at_display.short_description = 'Data de Criação'

    def get_readonly_fields(self, request, obj=None):
        """Torna company_id somente leitura após a criação"""
        if obj:  # Se o objeto já existe
            return list(self.readonly_fields) + ['company_id']
        return self.readonly_fields