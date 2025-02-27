# backend/api/views/base.py
from rest_framework import viewsets, status
from rest_framework.response import Response

class BaseViewSet(viewsets.ModelViewSet):
    """Base ViewSet with common functionality"""
    
    def get_queryset(self):
        """
        Retorna queryset filtrado por company e enabled
        """
        model = self.queryset.model
        if model.__name__ == 'Company':
            return self.queryset.filter(enabled=True)
        # return self.queryset.filter(company_id=self.request.user.company_id, enabled=True)
        return self.queryset.filter(company_id=self.request.user.company.id if self.request.user.company else None, enabled=True)

    def perform_destroy(self, instance):
        """Override destroy method to perform soft delete using BaseModel method"""
        instance.soft_delete()
        
    def perform_create(self, serializer):
        """
        Sobrescreve criação para incluir company automaticamente
        """
        if serializer.Meta.model.__name__ != 'Company':
            serializer.save(company_id=self.request.user.company.id if self.request.user.company else None)
        else:
            serializer.save()