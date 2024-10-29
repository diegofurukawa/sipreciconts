# backend/api/serializers/supply.py
from rest_framework import serializers
from ..models import Supply
from .base import BaseSerializer

class SupplySerializer(BaseSerializer):
    """Serializer for Supply model"""
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    unit_measure_display = serializers.CharField(source='get_unit_measure_display', read_only=True)

    class Meta:
        model = Supply
        fields = [
            'id', 'name', 'nick_name', 'ean_code', 'description',
            'unit_measure', 'unit_measure_display', 'type', 'type_display',
            'created', 'updated', 'enabled'
        ]