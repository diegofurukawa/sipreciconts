# api/admin.py

from django.contrib import admin
from .models import Customer, Tax

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'document', 'celphone', 'email', 'enabled']
    list_filter = ['enabled', 'customer_type']
    search_fields = ['name', 'document', 'email']


# api/admin.py

@admin.register(Tax)
class TaxAdmin(admin.ModelAdmin):
    list_display = ['acronym', 'description', 'type', 'group', 'value', 'enabled']
    list_filter = ['type', 'group', 'enabled']
    search_fields = ['description', 'acronym']