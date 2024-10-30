# api/admin/location.py
from django.contrib import admin
from api.models import Location

@admin.register(Location)
class LocationAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'created', 'updated']
    list_filter = ['created', 'updated']
    search_fields = ['name', 'address']