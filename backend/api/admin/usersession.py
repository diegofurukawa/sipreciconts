# api/admin.py
from django.contrib import admin
from ..models.usersession_model import UserSession

@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'user', 'company_id', 'is_active', 'date_start', 'date_end']
    list_filter = ['is_active', 'date_start']
    search_fields = ['session_id', 'user__username']
    readonly_fields = ['session_id', 'date_start', 'last_activity']