# apps/assets/admin/assets_admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import F, Sum
from ..models import Asset, AssetGroup, AssetCategory, AssetMovement

@admin.register(AssetGroup)
class AssetGroupAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'enabled', 'created', 'updated')
    list_filter = ('enabled', 'created')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)
    readonly_fields = ('created', 'updated')
    list_per_page = 20

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'code', 'description')
        }),
        ('Controle', {
            'fields': ('enabled', 'created', 'updated'),
            'classes': ('collapse',)
        }),
    )

@admin.register(AssetCategory)
class AssetCategoryAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'asset_group', 'enabled', 'created')
    list_filter = ('enabled', 'asset_group', 'created')
    search_fields = ('name', 'code', 'description')
    ordering = ('name',)
    readonly_fields = ('created', 'updated')
    list_per_page = 20

    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'code', 'description', 'asset_group')
        }),
        ('Controle', {
            'fields': ('enabled', 'created', 'updated'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('asset_group')

@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('asset_code', 'name', 'category', 'quantity_status', 'status_colored', 
                   'location', 'updated')
    list_filter = ('status', 'asset_group', 'category', 'enabled')
    search_fields = ('name', 'asset_code', 'patrimony_code', 'serial_number', 'location')
    ordering = ('name',)
    readonly_fields = ('created', 'updated')
    list_per_page = 20
    actions = ['mark_as_maintenance', 'mark_as_available']

    fieldsets = (
        ('Identificação', {
            'fields': (
                'name', 'description', 'asset_group', 'category',
                'asset_code', 'patrimony_code', 'serial_number'
            )
        }),
        ('Estoque', {
            'fields': (
                'quantity', 'minimum_quantity', 'unit_measure'
            )
        }),
        ('Valores', {
            'fields': (
                'purchase_value', 'current_value'
            ),
            'classes': ('collapse',)
        }),
        ('Status e Localização', {
            'fields': (
                'status', 'location', 'acquisition_date',
                'warranty_expiration', 'next_maintenance'
            )
        }),
        ('Observações', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('Controle', {
            'fields': ('enabled', 'created', 'updated'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'asset_group', 'category'
        )

    def quantity_status(self, obj):
        if not obj.minimum_quantity:
            return format_html(
                '<span style="color: gray;">Qtd: {}</span>',
                obj.quantity
            )
        
        if obj.quantity <= obj.minimum_quantity:
            return format_html(
                '<span style="color: red;">Qtd: {} (Min: {})</span>',
                obj.quantity, obj.minimum_quantity
            )
        return format_html(
            '<span style="color: green;">Qtd: {}</span>',
            obj.quantity
        )
    quantity_status.short_description = 'Quantidade'

    def status_colored(self, obj):
        colors = {
            'available': 'green',
            'in_use': 'blue',
            'maintenance': 'orange',
            'reserved': 'purple',
            'disposed': 'red',
            'sold': 'gray'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_colored.short_description = 'Status'

    def mark_as_maintenance(self, request, queryset):
        updated = queryset.update(status='maintenance')
        self.message_user(
            request,
            f'{updated} ativos marcados como em manutenção.'
        )
    mark_as_maintenance.short_description = "Marcar selecionados como em manutenção"

    def mark_as_available(self, request, queryset):
        updated = queryset.update(status='available')
        self.message_user(
            request,
            f'{updated} ativos marcados como disponíveis.'
        )
    mark_as_available.short_description = "Marcar selecionados como disponíveis"

@admin.register(AssetMovement)
class AssetMovementAdmin(admin.ModelAdmin):
    list_display = ('movement_date', 'asset', 'movement_type_colored', 
                   'quantity', 'from_location', 'to_location', 'created_by')
    list_filter = ('movement_type', 'movement_date', 'created_by')
    search_fields = ('asset__name', 'asset__asset_code', 'reference_document', 
                    'from_location', 'to_location')
    ordering = ('-movement_date',)
    readonly_fields = ('created', 'updated', 'created_by')
    list_per_page = 20

    fieldsets = (
        ('Informações da Movimentação', {
            'fields': (
                'asset', 'movement_type', 'quantity',
                'from_location', 'to_location', 'movement_date'
            )
        }),
        ('Documentação', {
            'fields': (
                'reference_document', 'notes'
            )
        }),
        ('Controle', {
            'fields': ('created_by', 'created', 'updated'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'asset', 'created_by'
        )

    def movement_type_colored(self, obj):
        colors = {
            'in': 'green',
            'out': 'red',
            'transfer': 'blue',
            'adjustment': 'orange',
            'maintenance': 'purple',
            'return': 'teal'
        }
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.movement_type, 'black'),
            obj.get_movement_type_display()
        )
    movement_type_colored.short_description = 'Tipo de Movimento'

    def save_model(self, request, obj, form, change):
        if not change:  # Se é uma nova movimentação
            obj.created_by = request.user
        super().save_model(request, obj, form, change)