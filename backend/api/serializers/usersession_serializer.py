# sessions/serializers.py
from rest_framework import serializers
from ..models.usersession_model import UserSession

class UserSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSession
        fields = [
            'session_id', 
            'user', 
            'company_id',
            'date_start',
            'date_end', 
            'is_active',
            'last_activity'
        ]
        read_only_fields = ['session_id', 'date_start', 'last_activity']