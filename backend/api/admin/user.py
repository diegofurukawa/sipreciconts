# backend/api/admin/user.py
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from ..models.user import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        'user_name',
        'email',
        'login',
        'type',
        'company',
        'enabled',
        'last_login'
    )
    
    list_filter = (
        'type',
        'enabled',
        'company'
    )
    
    search_fields = (
        'user_name',
        'email',
        'login'
    )
    
    readonly_fields = (
        'created',
        'updated',
        'last_login'
    )
    
    fieldsets = (
        ('Informações Principais', {
            'fields': (
                'user_name',
                'email',
                'login',
                'password',
                'type',
                'company'
            )
        }),
        ('Status', {
            'fields': (
                'enabled',
            )
        }),
        ('Informações de Sistema', {
            'fields': (
                'created',
                'updated',
                'last_login'
            ),
            'classes': ('collapse',)
        })
    )

    def get_readonly_fields(self, request, obj=None):
        if obj:  # Se estiver editando um objeto existente
            return self.readonly_fields + ('created', 'updated')
        return self.readonly_fields

    def save_model(self, request, obj, form, change):
        """
        Sobrescreve o método de salvamento
        Agora não usa mais set_password, usa o próprio save do modelo
        que já trata a criptografia da senha
        """
        obj._password_changed = 'password' in form.changed_data
        super().save_model(request, obj, form, change)