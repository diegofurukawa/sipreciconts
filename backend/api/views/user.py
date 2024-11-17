# backend/api/views/user.py
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from ..models.user import User
from ..serializers.user import UserSerializer
import csv
import io
from datetime import datetime
from typing import Any, Dict, List

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de usuários.
    Fornece endpoints para CRUD de usuários e operações de importação/exportação.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
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

        try:
            decoded_file = file.read().decode('utf-8-sig')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string, delimiter=';')
            
            success_count = 0
            error_rows = []
            company = request.user.company

            required_fields = {'Nome', 'Email', 'Login'}
            if not all(field in reader.fieldnames for field in required_fields):
                return Response(
                    {'error': f'Campos obrigatórios faltando. Necessários: {required_fields}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            for row in reader:
                try:
                    user_data = {
                        'user_name': row.get('Nome', '').strip(),
                        'email': row.get('Email', '').strip(),
                        'login': row.get('Login', '').strip(),
                        'type': row.get('Tipo', 'Usuario').strip(),
                        'password': 'ChangeMe123!',
                        'password_confirm': 'ChangeMe123!',
                        'company': company.id if company else None
                    }

                    # Validações básicas
                    if not user_data['user_name'] or not user_data['email'] or not user_data['login']:
                        raise ValueError("Campos obrigatórios não preenchidos")

                    serializer = self.get_serializer(data=user_data)
                    if serializer.is_valid():
                        serializer.save()
                        success_count += 1
                    else:
                        error_rows.append({
                            'row': row,
                            'errors': serializer.errors
                        })

                except Exception as e:
                    error_rows.append({
                        'row': row,
                        'error': str(e)
                    })

            return Response({
                'message': f'{success_count} usuários importados com sucesso.',
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
            filename = f'usuarios_{timestamp}.csv'
            
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

            users = self.get_queryset()
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
                {'error': f'Erro ao exportar dados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )