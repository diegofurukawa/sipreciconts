# backend/api/admin/user.py
from django.contrib import admin
from django.contrib.auth.hashers import make_password
from ..models.user_model import User

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
        Garante que a senha seja sempre hasheada corretamente usando set_password
        """
        if 'password' in form.changed_data:
            # Salva a senha em texto puro em uma variável temporária
            password = form.cleaned_data['password']
            # Usa o mecanismo padrão do Django para hash de senha
            obj.set_password(password)
        
        super().save_model(request, obj, form, change)