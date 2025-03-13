# api/views/supplies_price_list_view.py
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
import io
from datetime import datetime
from django.core.exceptions import ValidationError
from django.db.models import Q
from ..models import SuppliesPriceList, Supply, Tax
from ..serializers.supplies_price_list_serializer import SuppliesPriceListSerializer
from .base_view import BaseViewSet

class SuppliesPriceListViewSet(BaseViewSet):
    """
    ViewSet para gerenciamento de listas de preços de insumos.
    """
    queryset = SuppliesPriceList.objects.filter(enabled=True)
    serializer_class = SuppliesPriceListSerializer

    permission_classes = [IsAuthenticated]
    lookup_field = 'supplies_price_list_id'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['supply__name', 'tax__acronym']
    ordering_fields = ['supply__name', 'value', 'sequence', 'created', 'updated']
    ordering = ['sequence', 'supply__name']

    def get_queryset(self):
        """
        Retorna queryset filtrado por company e enabled
        """
        if not self.request.user.company:
            return SuppliesPriceList.objects.none()
            
        queryset = SuppliesPriceList.objects.filter(
            company=self.request.user.company,
            enabled=True
        ).select_related('supply', 'tax')
        
        # Filtro por supply_id se fornecido
        supply_id = self.request.query_params.get('supply_id')
        if supply_id:
            queryset = queryset.filter(supply_id=supply_id)
            
        # Filtro por tax_id se fornecido
        tax_id = self.request.query_params.get('tax_id')
        if tax_id:
            queryset = queryset.filter(tax_id=tax_id)
            
        return queryset

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
        instance.soft_delete()

    @action(detail=False, methods=['GET'])
    def export(self, request):
        """
        Endpoint para exportar listas de preços para CSV
        """
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            company_name = request.user.company.name.lower().replace(' ', '_')
            filename = f'precos_insumos_{company_name}_{timestamp}.csv'
            
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
                'Insumo',
                'Código Insumo',
                'Imposto',
                'Sigla Imposto',
                'Valor',
                'Sequência',
                'Data de Cadastro',
                'Última Atualização'
            ])

            price_lists = self.get_queryset()
            for price in price_lists:
                writer.writerow([
                    price.supply.name,
                    price.supply.supply_id,
                    price.tax.description if price.tax else '',
                    price.tax.acronym if price.tax else '',
                    price.value,
                    price.sequence,
                    price.created.strftime('%d/%m/%Y %H:%M:%S'),
                    price.updated.strftime('%d/%m/%Y %H:%M:%S')
                ])

            return response
            
        except Exception as e:
            return Response(
                {'error': f'Erro ao exportar dados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['POST'])
    def import_prices(self, request):
        """
        Endpoint para importar lista de preços via CSV
        """
        try:
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'Nenhum arquivo foi enviado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file = request.FILES['file']
            if not file.name.endswith('.csv'):
                return Response(
                    {'error': 'Formato de arquivo inválido. Use CSV.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Decodificar o arquivo
            decoded_file = file.read().decode('utf-8-sig')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string, delimiter=';')
            
            # Verificar cabeçalhos obrigatórios
            required_headers = {'Código Insumo', 'Valor'}
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
                    supply_code = row.get('Código Insumo', '').strip()
                    tax_acronym = row.get('Sigla Imposto', '').strip()
                    
                    try:
                        value = float(row.get('Valor', '0').replace(',', '.'))
                    except ValueError:
                        raise ValidationError('Valor inválido')
                    
                    try:
                        sequence = int(row.get('Sequência', '1'))
                    except ValueError:
                        sequence = 1
                    
                    # Validações básicas
                    if not supply_code:
                        raise ValidationError('Código do insumo é obrigatório')
                    
                    if value <= 0:
                        raise ValidationError('Valor deve ser maior que zero')
                    
                    # Buscar supply pelo código
                    try:
                        supply = Supply.objects.get(
                            supply_id=supply_code,
                            company=company,
                            enabled=True
                        )
                    except Supply.DoesNotExist:
                        raise ValidationError(f'Insumo não encontrado: {supply_code}')
                    
                    # Buscar tax pela sigla (se fornecido)
                    tax = None
                    if tax_acronym:
                        try:
                            tax = Tax.objects.get(
                                acronym=tax_acronym,
                                company=company,
                                enabled=True
                            )
                        except Tax.DoesNotExist:
                            raise ValidationError(f'Imposto não encontrado: {tax_acronym}')
                    
                    # Verificar se já existe um registro para este supply+tax na mesma empresa
                    price_list, created = SuppliesPriceList.objects.update_or_create(
                        supply=supply,
                        tax=tax,
                        company=company,
                        defaults={
                            'value': value,
                            'sequence': sequence,
                            'enabled': True
                        }
                    )
                    
                    success_count += 1
                    
                except Exception as e:
                    error_rows.append({
                        'row': row,
                        'error': str(e)
                    })

            message = f'{success_count} preços importados com sucesso.'
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
            
    @action(detail=False, methods=['GET'])
    def by_supply(self, request):
        """
        Endpoint para obter preços filtrados por supply_id
        """
        supply_id = request.query_params.get('supply_id')
        if not supply_id:
            return Response(
                {'error': 'Parâmetro supply_id é obrigatório'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        queryset = self.get_queryset().filter(supply_id=supply_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)