# backend/api/admin.py
from django.contrib import admin
from ..models import Company

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['company_id', 'nick_name', 'full_name', 'type', 'document', 'phone', 'enabled']  # Corrigido para usar 'id' ao invés de 'company_id'
    list_filter = ['type', 'enabled']
    search_fields = ['nick_name', 'full_name', 'document']
    ordering = ['nick_name']
    #readonly_fields = ['id', 'created', 'updated']  # Adicionado 'id' aos campos somente leitura
    readonly_fields = ['created', 'updated']  # Adicionado 'id' aos campos somente leitura
    
    # Opcional: Adicionar campos personalizados
    def get_type_display_name(self, obj):
        return obj.get_type_display()
    get_type_display_name.short_description = 'Tipo'
    
    # Opcional: Personalizar como o ID é exibido
    def get_id_display(self, obj):
        return f"#{obj.id}"
    get_id_display.short_description = 'ID'