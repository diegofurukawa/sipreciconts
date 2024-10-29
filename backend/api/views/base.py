# backend/api/views/base.py
from rest_framework import viewsets, status
from rest_framework.response import Response

class BaseViewSet(viewsets.ModelViewSet):
    """Base ViewSet with common functionality"""
    
    def perform_destroy(self, instance):
        """Override destroy method to perform soft delete"""
        instance.enabled = False
        instance.save()