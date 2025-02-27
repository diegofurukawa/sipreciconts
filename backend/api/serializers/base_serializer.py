# backend/api/serializers/base.py
from rest_framework import serializers

class BaseSerializer(serializers.ModelSerializer):
    """Base serializer with common fields"""
    created = serializers.DateTimeField(read_only=True)
    updated = serializers.DateTimeField(read_only=True)
    enabled = serializers.BooleanField(read_only=True)
