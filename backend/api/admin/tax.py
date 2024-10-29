# api/admin.py

from django.contrib import admin
from ..models import Tax

@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
    list_display = ['acronym', 'description', 'type', 'group', 'value', 'enabled']
    list_filter = ['type', 'group', 'enabled']
    search_fields = ['description', 'acronym']