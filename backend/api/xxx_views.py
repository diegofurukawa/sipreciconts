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
from .models import Customer, Tax
from .serializers import CustomerSerializer, TaxSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento de clientes.
    Fornece operações CRUD padrão mais endpoints personalizados para importação e exportação.
    """
    queryset = Customer.objects.filter(enabled=True)
    serializer_class = CustomerSerializer
    
    def perform_destroy(self, instance):
        """
        Sobrescreve o método de exclusão para realizar soft delete
        """
        instance.enabled = False
        instance.save()

    @action(detail=False, methods=['GET'], renderer_classes=[JSONRenderer])
    def export(self, request, *args, **kwargs):
        """
        Endpoint para exportar clientes para CSV
        """
        try:
            # Configurar o response com o tipo correto
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'clientes_{timestamp}.csv'
            
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': f'attachment; filename="{filename}"',
                    'Access-Control-Expose-Headers': 'Content-Disposition'
                },
            )

            # Adicionar BOM para UTF-8
            response.write('\ufeff')

            # Criar o writer do CSV
            writer = csv.writer(response, delimiter=';', quoting=csv.QUOTE_ALL)
            
            # Escrever cabeçalhos
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

            # Buscar e escrever dados
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
                    customer.created.strftime('%d/%m/%Y %H:%M:%S') if customer.created else '',
                    customer.updated.strftime('%d/%m/%Y %H:%M:%S') if customer.updated else ''
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
            
            # Validar cabeçalhos
            required_headers = {'Nome', 'Celular'}
            headers = set(reader.fieldnames) if reader.fieldnames else set()
            if not required_headers.issubset(headers):
                return Response(
                    {'error': f'Cabeçalhos obrigatórios faltando. Necessários: {required_headers}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            for row in reader:
                try:
                    # Limpar e validar dados
                    cleaned_data = {
                        'name': row.get('Nome', '').strip(),
                        'document': re.sub(r'[^\d]', '', row.get('Documento', '')),
                        'customer_type': row.get('Tipo de Cliente', '').strip(),
                        'celphone': re.sub(r'[^\d]', '', row.get('Celular', '')),
                        'email': row.get('Email', '').strip(),
                        'address': row.get('Endereço', '').strip(),
                        'complement': row.get('Complemento', '').strip()
                    }

                    # Validações básicas
                    if not cleaned_data['name']:
                        raise ValidationError('Nome é obrigatório')
                    
                    if not cleaned_data['celphone']:
                        raise ValidationError('Celular é obrigatório')
                    
                    if cleaned_data['email'] and '@' not in cleaned_data['email']:
                        raise ValidationError('Email inválido')

                    # Verificar existência do cliente pelo documento
                    customer = None
                    if cleaned_data['document']:
                        customer = Customer.objects.filter(
                            document=cleaned_data['document'],
                            enabled=True
                        ).first()

                    if customer:
                        # Atualizar cliente existente
                        for key, value in cleaned_data.items():
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

            # Preparar mensagem de retorno
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

    def get_queryset(self):
        """
        Sobrescreve o queryset padrão para adicionar ordenação
        e possibilidade de filtros futuros
        """
        queryset = super().get_queryset()
        return queryset.order_by('name')
    

# api/views.py

# Adicionar junto com o CustomerViewSet
class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.filter(enabled=True)
    serializer_class = TaxSerializer

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=False, methods=['GET'])
    def export(self, request):
        """
        Endpoint para exportar impostos para CSV
        """
        try:
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': 'attachment; filename="impostos.csv"',
                }
            )

            writer = csv.writer(response)
            writer.writerow([
                'Descrição',
                'Tipo',
                'Sigla',
                'Grupo',
                'Operador',
                'Valor'
            ])

            taxes = self.get_queryset()
            for tax in taxes:
                writer.writerow([
                    tax.description,
                    tax.get_type_display(),
                    tax.acronym,
                    tax.get_group_display(),
                    tax.get_calc_operator_display(),
                    tax.value
                ])

            return response
        except Exception as e:
            return Response(
                {'error': f'Erro ao exportar dados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['POST'])
    def import_taxes(self, request):
        """
        Endpoint para importar impostos via CSV
        """
        try:
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'Nenhum arquivo foi enviado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file = request.FILES['file']
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            for row in reader:
                Tax.objects.create(
                    description=row['Descrição'],
                    type=row['Tipo'],
                    acronym=row['Sigla'],
                    group=row['Grupo'],
                    calc_operator=row['Operador'],
                    value=row['Valor']
                )

            return Response({'message': 'Impostos importados com sucesso'})
        except Exception as e:
            return Response(
                {'error': f'Erro ao importar dados: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )