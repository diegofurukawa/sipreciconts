from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
import csv
import io
from datetime import datetime
import re
from django.core.exceptions import ValidationError
from ..models import Customer, Tax
from ..serializers import CustomerSerializer, TaxSerializer
from .base_view import BaseViewSet  # Importa BaseViewSet

class CustomerViewSet(BaseViewSet):
    """
    ViewSet para gerenciamento de clientes.
    Fornece operações CRUD padrão mais endpoints personalizados para importação e exportação.
    """
    serializer_class = CustomerSerializer
    queryset = Customer.objects.all()  # BaseViewSet já filtra por enabled=True
    
    def get_queryset(self):
        """
        Retorna queryset filtrado por company e enabled
        """
        if not self.request.user.company:
            return Customer.objects.none()
            
        return Customer.objects.filter(
            company=self.request.user.company,
            enabled=True
        )

    def perform_create(self, serializer):
        """
        Sobrescreve criação para incluir company automaticamente
        """
        if not self.request.user.company:
            raise ValidationError('Usuário não está associado a uma empresa')
            
        serializer.save(company=self.request.user.company)

    def perform_destroy(self, instance):
        """
        Sobrescreve o método de exclusão para realizar soft delete
        """
        instance.soft_delete()  # Usa o método do BaseModel

    @action(detail=False, methods=['GET'], renderer_classes=[JSONRenderer])
    def export(self, request, *args, **kwargs):
        """
        Endpoint para exportar clientes para CSV
        """
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            company_name = request.user.company.name.lower().replace(' ', '_')
            filename = f'clientes_{company_name}_{timestamp}.csv'
            
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': f'attachment; filename="{filename}"',
                    'Access-Control-Expose-Headers': 'Content-Disposition'
                },
            )

            response.write('\ufeff')  # UTF-8 BOM
            writer = csv.writer(response, delimiter=';', quoting=csv.QUOTE_ALL)
            
            headers = [
                'Nome',
                'Documento',
                'Tipo de Cliente',
                'Celular',
                'Email',
                'Endereço',
                'Complemento',
                'Data de Cadastro',
                'Última Atualização'
            ]
            writer.writerow(headers)

            # Usa get_queryset para garantir filtragem por company
            customers = self.get_queryset().order_by('name')
            for customer in customers:
                row = [
                    str(customer.name),
                    str(customer.document) if customer.document else '',
                    str(customer.customer_type) if customer.customer_type else '',
                    str(customer.celphone),
                    str(customer.email) if customer.email else '',
                    str(customer.address) if customer.address else '',
                    str(customer.complement) if customer.complement else '',
                    customer.created.strftime('%d/%m/%Y %H:%M:%S'),
                    customer.updated.strftime('%d/%m/%Y %H:%M:%S')
                ]
                writer.writerow(row)

            return response

        except Exception as e:
            return Response(
                {'error': f'Erro ao exportar dados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['POST'])
    def import_customers(self, request):
        """
        Endpoint para importar clientes via CSV
        """
        try:
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'Nenhum arquivo foi enviado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            csv_file = request.FILES['file']
            if not csv_file.name.endswith('.csv'):
                return Response(
                    {'error': 'Formato de arquivo inválido. Use CSV.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Decodificar o arquivo
            decoded_file = csv_file.read().decode('utf-8-sig')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string, delimiter=';')

            success_count = 0
            error_rows = []
            
            required_headers = {'Nome', 'Celular'}
            headers = set(reader.fieldnames) if reader.fieldnames else set()
            if not required_headers.issubset(headers):
                return Response(
                    {'error': f'Cabeçalhos obrigatórios faltando. Necessários: {required_headers}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            company_id = request.user.company_id

            for row in reader:
                try:
                    cleaned_data = {
                        'name': row.get('Nome', '').strip(),
                        'document': re.sub(r'[^\d]', '', row.get('Documento', '')),
                        'customer_type': row.get('Tipo de Cliente', '').strip(),
                        'celphone': re.sub(r'[^\d]', '', row.get('Celular', '')),
                        'email': row.get('Email', '').strip(),
                        'address': row.get('Endereço', '').strip(),
                        'complement': row.get('Complemento', '').strip(),
                        'company_id': company_id  # Adiciona company_id automaticamente
                    }

                    # Validações básicas
                    if not cleaned_data['name']:
                        raise ValidationError('Nome é obrigatório')
                    
                    if not cleaned_data['celphone']:
                        raise ValidationError('Celular é obrigatório')
                    
                    if cleaned_data['email'] and '@' not in cleaned_data['email']:
                        raise ValidationError('Email inválido')

                    # Verificar existência do cliente pelo documento na mesma company
                    customer = None
                    if cleaned_data['document']:
                        customer = Customer.objects.filter(
                            document=cleaned_data['document'],
                            company_id=company_id,
                            enabled=True
                        ).first()

                    if customer:
                        # Atualizar cliente existente
                        for key, value in cleaned_data.items():
                            if key != 'company_id':  # Não permite alterar company_id
                                setattr(customer, key, value)
                        customer.save()
                    else:
                        # Criar novo cliente
                        Customer.objects.create(**cleaned_data)

                    success_count += 1

                except Exception as e:
                    error_rows.append({
                        'row': row,
                        'error': str(e)
                    })

            message = f'{success_count} clientes importados com sucesso.'
            if error_rows:
                message += f' {len(error_rows)} erros encontrados.'

            return Response({
                'success': True,
                'message': message,
                'errors': error_rows if error_rows else None
            })

        except Exception as e:
            return Response(
                {'error': f'Erro ao processar arquivo: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )