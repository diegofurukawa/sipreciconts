# backend/api/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from ..serializers import CompanySerializer, CompanyDetailSerializer, CompanyListSerializer
from ..models import Company

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.filter(enabled=True)
    
    def get_serializer_class(self):
        """
        Use diferentes serializers baseado na ação
        """
        if self.action == 'list':
            return CompanyListSerializer
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return CompanyDetailSerializer
        return CompanySerializer

    def list(self, request, *args, **kwargs):
        """
        Sobrescreve o método list para adicionar mais informações
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response({
                'results': serializer.data,
                'total_count': queryset.count(),
            })

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'results': serializer.data,
            'total_count': queryset.count(),
        })

    def retrieve(self, request, *args, **kwargs):
        """
        Sobrescreve o método retrieve para garantir que sempre retorne o id
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)