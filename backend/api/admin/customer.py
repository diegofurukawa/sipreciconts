# api/admin.py

from django.contrib import admin
from ..models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['name', 'document', 'celphone', 'email', 'enabled']
    list_filter = ['enabled', 'customer_type']
    search_fields = ['name', 'document', 'email']
