# backend/api/serializers/supply.py
from rest_framework import serializers
from ..models import Supply
from .base_serializer import BaseSerializer

class SupplySerializer(BaseSerializer):
    """Serializer for Supply model"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    unit_measure_display = serializers.CharField(source='get_unit_measure_display', read_only=True)
    company_id = serializers.CharField(source='company.company_id', read_only=True)

    class Meta:
        model = Supply
        fields = [
            'supply_id', 'name', 'nick_name', 'ean_code', 'description',
            'unit_measure', 'unit_measure_display', 'type', 'type_display',
            'company_id', 'created', 'updated', 'enabled'
        ]
        read_only_fields = ['created', 'updated', 'company_id']