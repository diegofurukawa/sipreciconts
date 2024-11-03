# api/views/company.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..serializers import CompanySerializer, CompanyDetailSerializer, CompanyListSerializer
from ..models import Company

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.filter(enabled=True)
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        """
        Use diferentes serializers baseado na ação
        """
        if self.action == 'list':
            return CompanyListSerializer
        if self.action in ['retrieve', 'create', 'update', 'partial_update', 'current']:
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

    @action(detail=False, methods=['GET'])
    def current(self, request):
        """
        Retorna a empresa atual do usuário logado.
        Se não houver empresa, retorna 404.
        """
        try:
            # Primeiro tenta pegar a empresa onde o usuário é admin
            company = Company.objects.filter(
                administrators=request.user,
                enabled=True
            ).first()

            # Se não for admin, tenta pegar a empresa onde é funcionário
            if not company:
                company = Company.objects.filter(
                    employees=request.user,
                    enabled=True
                ).first()

            if not company:
                return Response(
                    {'detail': 'Usuário não está associado a nenhuma empresa'},
                    status=status.HTTP_404_NOT_FOUND
                )

            serializer = self.get_serializer(company)
            return Response(serializer.data)

        except Exception as e:
            return Response(
                {'detail': f'Erro ao buscar empresa atual: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        """
        Ao criar uma empresa, adiciona o usuário atual como administrador
        """
        company = serializer.save()
        company.administrators.add(self.request.user)

    def perform_destroy(self, instance):
        """
        Sobrescreve o método de exclusão para realizar soft delete
        """
        instance.enabled = False
        instance.save()

    @action(detail=True, methods=['POST'])
    def add_administrator(self, request, pk=None):
        """
        Adiciona um administrador à empresa
        """
        company = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'detail': 'ID do usuário é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            company.administrators.add(user_id)
            return Response(
                {'detail': 'Administrador adicionado com sucesso'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'detail': f'Erro ao adicionar administrador: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['POST'])
    def add_employee(self, request, pk=None):
        """
        Adiciona um funcionário à empresa
        """
        company = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'detail': 'ID do usuário é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            company.employees.add(user_id)
            return Response(
                {'detail': 'Funcionário adicionado com sucesso'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'detail': f'Erro ao adicionar funcionário: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['POST'])
    def remove_administrator(self, request, pk=None):
        """
        Remove um administrador da empresa
        """
        company = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {'detail': 'ID do usuário é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            company.administrators.remove(user_id)
            return Response(
                {'detail': 'Administrador removido com sucesso'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'detail': f'Erro ao remover administrador: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['POST'])
    def remove_employee(self, request, pk=None):
        """
        Remove um funcionário da empresa
        """
        company = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {'detail': 'ID do usuário é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            company.employees.remove(user_id)
            return Response(
                {'detail': 'Funcionário removido com sucesso'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'detail': f'Erro ao remover funcionário: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )