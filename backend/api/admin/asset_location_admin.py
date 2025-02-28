# api/admin/asset_location.py
from django.contrib import admin
from api.models import AssetLocation

@admin.register(AssetLocation)
class AssetLocationAdmin(admin.ModelAdmin):
    list_display = ['asset', 'location', 'start_date', 'end_date', 'current']
    list_filter = ['current', 'start_date', 'end_date', 'location']
    search_fields = ['asset__name', 'location__name', 'notes']
    raw_id_fields = ['asset', 'location']