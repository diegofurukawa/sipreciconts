# backend/api/views/user.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from ..models.user import User
from ..serializers.user import UserSerializer
import csv
import io
from datetime import datetime

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    
    def get_queryset(self):
        """
        Filtra usuários pela empresa do usuário autenticado
        """
        # Assumindo que o usuário autenticado tem uma empresa associada
        return User.objects.filter(
            enabled=True,
            company=self.request.user.company
        )

    def perform_create(self, serializer):
        """
        Associa o usuário à empresa do usuário autenticado
        """
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=['POST'])
    def import_users(self, request):
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

            for row in reader:
                try:
                    user_data = {
                        'user_name': row.get('Nome', '').strip(),
                        'email': row.get('Email', '').strip(),
                        'login': row.get('Login', '').strip(),
                        'type': row.get('Tipo', 'Usuario').strip(),
                        'password': 'ChangeMe123!',
                        'password_confirm': 'ChangeMe123!',
                        'company': company.id
                    }

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
                'errors': error_rows if error_rows else None
            })

        except Exception as e:
            return Response(
                {'error': f'Erro ao processar arquivo: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['GET'])
    def export(self, request):
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="usuarios_{timestamp}.csv"'
            
            writer = csv.writer(response, delimiter=';')
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
                    user.user_name,
                    user.email,
                    user.login,
                    user.get_type_display(),
                    user.company.name,
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