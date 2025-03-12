# backend/api/views/user.py
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from django.contrib.auth.hashers import make_password
from ..models.user_model import User
from ..serializers.user_serializer import UserSerializer
import csv
import io
from datetime import datetime
from typing import Any, Dict, List

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de usuários.
    Fornece endpoints para CRUD de usuários e operações de importação/exportação.
    """
    queryset = User.objects.filter(enabled=True)
    serializer_class = UserSerializer

    permission_classes = [IsAuthenticated]
    lookup_field = 'id'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user_name', 'email', 'login']
    ordering_fields = ['login', 'user_name']
    ordering = ['login']
    
    def get_queryset(self):
        """
        Filtra usuários pela empresa do usuário autenticado
        """
        try:
            if not self.request.user.is_authenticated:
                return User.objects.none()
                
            company = getattr(self.request.user, 'company', None)
            base_queryset = User.objects.filter(enabled=True)
            
            if company:
                base_queryset = base_queryset.filter(company=company)
            
            return base_queryset.select_related('company')  # Otimização de query
            
        except Exception as e:
            print(f"Erro ao obter queryset de usuários: {str(e)}")
            return User.objects.none()
        
        
    def perform_create(self, serializer):
        """
        Associa o usuário à empresa do usuário autenticado
        """
        try:
            serializer.save(
                company=self.request.user.company if self.request.user and self.request.user.company else None
            )
        except Exception as e:
            raise ValueError(f"Erro ao criar usuário: {str(e)}")

    @action(detail=False, methods=['POST'])
    def import_users(self, request) -> Response:
        """
        Importa usuários de um arquivo CSV/TXT
        """
        try:
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'Nenhum arquivo foi enviado.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file = request.FILES['file']
            if not file.name.endswith(('.csv', '.txt')):
                return Response(
                    {'error': 'Formato de arquivo inválido. Use CSV ou TXT.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Decodificar arquivo
            decoded_file = file.read().decode('utf-8-sig')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string, delimiter=';')
            
            # Verificar cabeçalhos obrigatórios
            required_headers = {'Nome', 'Email', 'Login'}
            headers = set(reader.fieldnames) if reader.fieldnames else set()
            if not required_headers.issubset(headers):
                return Response(
                    {'error': f'Cabeçalhos obrigatórios faltando. Necessários: {required_headers}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            success_count = 0
            error_rows = []
            company = request.user.company

            for row in reader:
                try:
                    # Extrair e validar dados
                    user_name = row.get('Nome', '').strip()
                    email = row.get('Email', '').strip()
                    login = row.get('Login', '').strip()
                    tipo = row.get('Tipo', 'Usuario').strip()
                    
                    # Validações básicas
                    if not user_name:
                        raise ValueError("Nome é obrigatório")
                    
                    if not email:
                        raise ValueError("Email é obrigatório")
                    
                    if not login:
                        raise ValueError("Login é obrigatório")
                        
                    # Verificar tipo válido
                    if tipo not in ['Admin', 'Usuario']:
                        tipo = 'Usuario'  # Valor padrão
                    
                    # Verificar existência do usuário
                    existing_user = User.objects.filter(
                        Q(login=login) | Q(email=email),
                        company_id=company.company_id,
                        enabled=True
                    ).first()
                    
                    if existing_user:
                        # Atualizar usuário existente (sem redefinir senha)
                        existing_user.user_name = user_name
                        existing_user.type = tipo
                        
                        # Atualiza o email apenas se for diferente
                        if existing_user.login == login and existing_user.email != email:
                            existing_user.email = email
                            
                        existing_user.save()
                        success_count += 1
                    else:
                        # Criar novo usuário
                        senha_padrao = 'ChangeMe123!'
                        
                        user = User(
                            user_name=user_name,
                            email=email,
                            login=login,
                            type=tipo,
                            company=company,
                            enabled=True
                        )
                        
                        # Usar método seguro para definir senha
                        user.set_password(senha_padrao)
                        user.save()
                        success_count += 1

                except Exception as e:
                    error_rows.append({
                        'row': row,
                        'error': str(e)
                    })

            # Mensagem de retorno
            message = f'{success_count} usuários importados com sucesso.'
            if error_rows:
                message += f' {len(error_rows)} erros encontrados.'

            return Response({
                'success': True,
                'message': message,
                'errors': error_rows if error_rows else None,
                'total_rows': success_count + len(error_rows)
            })

        except Exception as e:
            return Response(
                {'error': f'Erro ao processar arquivo: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'])
    def export(self, request) -> HttpResponse:
        """
        Exporta usuários para arquivo CSV
        """
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            company_name = request.user.company.name.lower().replace(' ', '_') if request.user.company else 'all'
            filename = f'usuarios_{company_name}_{timestamp}.csv'
            
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': f'attachment; filename="{filename}"',
                    'Access-Control-Expose-Headers': 'Content-Disposition'
                },
            )
            
            response.write('\ufeff')  # UTF-8 BOM
            writer = csv.writer(response, delimiter=';', quoting=csv.QUOTE_ALL)
            
            writer.writerow([
                'Nome',
                'Email',
                'Login',
                'Tipo',
                'Empresa',
                'Status',
                'Último Login',
                'Data de Criação'
            ])

            users = self.get_queryset().order_by('login')
            for user in users:
                writer.writerow([
                    str(user.user_name),
                    str(user.email),
                    str(user.login),
                    user.get_type_display(),
                    user.company.name if user.company else '',
                    'Ativo' if user.enabled else 'Inativo',
                    user.last_login.strftime('%d/%m/%Y %H:%M:%S') if user.last_login else 'Nunca',
                    user.created.strftime('%d/%m/%Y %H:%M:%S')
                ])

            return response

        except Exception as e:
            return Response(
                {'detail': f'Erro ao exportar dados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )