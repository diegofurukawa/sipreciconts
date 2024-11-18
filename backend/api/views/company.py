from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.http import Http404
from ..serializers import CompanySerializer, CompanyDetailSerializer, CompanyListSerializer
from ..models import Company

class CompanyViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de empresas.
    Fornece CRUD completo e endpoints adicionais para gestão de usuários.
    """
    queryset = Company.objects.filter(enabled=True)
    permission_classes = [IsAuthenticated]
    lookup_field = 'company_id'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'document', 'email']
    ordering_fields = ['name', 'created', 'updated']
    ordering = ['name']

    def get_serializer_class(self):
        """Retorna o serializer apropriado baseado na ação"""
        if self.action == 'list':
            return CompanyListSerializer
        if self.action in ['retrieve', 'create', 'update', 'partial_update', 'current']:
            return CompanyDetailSerializer
        return CompanySerializer

    def get_object(self):
        """
        Sobrescreve get_object para fazer busca case-insensitive do company_id
        """
        try:
            queryset = self.filter_queryset(self.get_queryset())
            
            # Get lookup value e converte para maiúsculo
            lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
            lookup_value = self.kwargs[lookup_url_kwarg].upper()
            
            # Log para debug
            print(f"Looking for company with {self.lookup_field}={lookup_value}")
            
            # Busca case-insensitive
            obj = queryset.get(company_id__iexact=lookup_value)
            self.check_object_permissions(self.request, obj)
            
            return obj
            
        except Company.DoesNotExist:
            raise Http404({'detail': 'Empresa não encontrada'})
        except Exception as e:
            print(f"Error retrieving company: {str(e)}")
            raise

    def get_queryset(self):
        """Retorna queryset base com filtros aplicados"""
        queryset = Company.objects.filter(enabled=True)
        print(f"Company queryset SQL: {queryset.query}")
        return queryset

    def list(self, request, *args, **kwargs):
        """Lista empresas com informações adicionais"""
        try:
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
        except Exception as e:
            return Response(
                {'detail': f'Erro ao listar empresas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def retrieve(self, request, *args, **kwargs):
        """Recupera uma empresa específica"""
        try:
            print(f"Retrieving company with args: {kwargs}")
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {'detail': 'Empresa não encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'detail': f'Erro ao buscar empresa: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['GET'])
    def current(self, request):
        """Retorna a empresa atual do usuário logado"""
        try:
            company = Company.objects.filter(
                Q(administrators=request.user) | Q(employees=request.user),
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

    def create(self, request, *args, **kwargs):
        """Cria uma nova empresa"""
        try:
            # Converte company_id para maiúsculo se fornecido
            if 'company_id' in request.data:
                request.data['company_id'] = request.data['company_id'].upper()

            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except Exception as e:
            return Response(
                {'detail': f'Erro ao criar empresa: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_create(self, serializer):
        """Ao criar uma empresa, adiciona o usuário como administrador"""
        company = serializer.save()
        company.administrators.add(self.request.user)

    def perform_destroy(self, instance):
        """Realiza soft delete ao invés de deletar permanentemente"""
        instance.enabled = False
        instance.save()

    @action(detail=True, methods=['POST'])
    def add_administrator(self, request, company_id=None):
        """Adiciona um administrador à empresa"""
        try:
            company = self.get_object()
            user_id = request.data.get('user_id')
            
            if not user_id:
                return Response(
                    {'detail': 'ID do usuário é obrigatório'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            company.administrators.add(user_id)
            return Response({'detail': 'Administrador adicionado com sucesso'})
        except Exception as e:
            return Response(
                {'detail': f'Erro ao adicionar administrador: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['POST'])
    def add_employee(self, request, company_id=None):
        """Adiciona um funcionário à empresa"""
        try:
            company = self.get_object()
            user_id = request.data.get('user_id')
            
            if not user_id:
                return Response(
                    {'detail': 'ID do usuário é obrigatório'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            company.employees.add(user_id)
            return Response({'detail': 'Funcionário adicionado com sucesso'})
        except Exception as e:
            return Response(
                {'detail': f'Erro ao adicionar funcionário: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['POST'])
    def remove_administrator(self, request, company_id=None):
        """Remove um administrador da empresa"""
        try:
            company = self.get_object()
            user_id = request.data.get('user_id')

            if not user_id:
                return Response(
                    {'detail': 'ID do usuário é obrigatório'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            company.administrators.remove(user_id)
            return Response({'detail': 'Administrador removido com sucesso'})
        except Exception as e:
            return Response(
                {'detail': f'Erro ao remover administrador: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['POST'])
    def remove_employee(self, request, company_id=None):
        """Remove um funcionário da empresa"""
        try:
            company = self.get_object()
            user_id = request.data.get('user_id')

            if not user_id:
                return Response(
                    {'detail': 'ID do usuário é obrigatório'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            company.employees.remove(user_id)
            return Response({'detail': 'Funcionário removido com sucesso'})
        except Exception as e:
            return Response(
                {'detail': f'Erro ao remover funcionário: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'])
    def check_exists(self, request):
        """Verifica se uma empresa existe"""
        company_id = request.query_params.get('company_id')
        if not company_id:
            return Response(
                {'detail': 'company_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        exists = Company.objects.filter(
            company_id__iexact=company_id.upper(),
            enabled=True
        ).exists()
        
        if exists:
            company = Company.objects.get(company_id__iexact=company_id.upper())
            return Response({
                'exists': True,
                'company': {
                    'id': company.company_id,
                    'name': company.name,
                    'enabled': company.enabled
                }
            })
        
        return Response({'exists': False})