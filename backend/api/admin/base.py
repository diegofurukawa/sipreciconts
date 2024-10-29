# backend/api/admin/base.py
from django.contrib import admin

class BaseAdmin(admin.ModelAdmin):
    """Base admin class with common configurations"""
    readonly_fields = ('created', 'updated')
    list_filter = ('enabled',)
    
    def get_queryset(self, request):
        """Show all records, including disabled ones"""
        return self.model.objects.all()