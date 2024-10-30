# apps/assets/admin/assets_admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import F, Sum
from ..models import Asset, AssetGroup, AssetCategory, AssetMovement, Location


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

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ('name', 'enabled', 'created_at', 'updated_at')
    list_filter = ('enabled',)
    search_fields = ('name', 'description')
    ordering = ('name',)

@admin.register(AssetMovement)
class AssetMovementAdmin(admin.ModelAdmin):
    list_display = (
        'movement_date',
        'movement_type',
        'asset',
        'quantity',
        'from_location',
        'to_location',
        'status',
        'created_by'
    )
    
    list_filter = (
        'status',
        'movement_date',
        'movement_type',
        'from_location',
        'to_location',
        'enabled'
    )
    
    readonly_fields = (
        'created',
        'updated',
        'created_by',
        'updated_by',
        'approved_by',
        'approved_at',
        'total_value'
    )
    
    search_fields = (
        'asset__name',
        'document_number',
        'description'
    )
    
    ordering = ('-movement_date', '-created')
    
    fieldsets = (
        ('Informações Principais', {
            'fields': (
                'movement_type',
                'movement_date',
                'asset',
                'quantity',
                'unit_value',
                'total_value'
            )
        }),
        ('Localização', {
            'fields': (
                'from_location',
                'to_location'
            )
        }),
        ('Detalhes', {
            'fields': (
                'document_number',
                'description',
                'status'
            )
        }),
        ('Auditoria', {
            'fields': (
                'created',
                'created_by',
                'updated',
                'updated_by',
                'approved_by',
                'approved_at',
                'enabled'
            ),
            'classes': ('collapse',)
        })
    )

    def save_model(self, request, obj, form, change):
        if not change:  # Se é uma nova instância
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)