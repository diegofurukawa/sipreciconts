from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from django.http import HttpResponse
import csv
import io
from datetime import datetime
import re
from django.core.exceptions import ValidationError
from ..models import Tax
from ..serializers import TaxSerializer
from .base_view import BaseViewSet

class TaxViewSet(BaseViewSet):
    queryset = Tax.objects.filter(enabled=True)
    serializer_class = TaxSerializer

    permission_classes = [IsAuthenticated]
    lookup_field = 'tax_id'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['acronym', 'description', 'group', 'type']
    ordering_fields = ['acronym', 'description', 'created', 'updated']
    ordering = ['acronym']

    def get_queryset(self):
        """
        Retorna queryset filtrado por company e enabled
        """
        if not self.request.user.company:
            return Tax.objects.none()
            
        return Tax.objects.filter(
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
        instance.soft_delete()

    @action(detail=False, methods=['GET'])
    def export(self, request):
        """
        Endpoint para exportar impostos para CSV
        """
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            company_name = request.user.company.name.lower().replace(' ', '_')
            filename = f'impostos_{company_name}_{timestamp}.csv'
            
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
                'Descrição',
                'Tipo',
                'Sigla',
                'Grupo',
                'Operador',
                'Valor',
                'Data de Cadastro',
                'Última Atualização'
            ])

            taxes = self.get_queryset().order_by('acronym')
            for tax in taxes:
                writer.writerow([
                    tax.description,
                    tax.get_type_display(),
                    tax.acronym,
                    tax.get_group_display(),
                    tax.get_calc_operator_display(),
                    tax.value,
                    tax.created.strftime('%d/%m/%Y %H:%M:%S'),
                    tax.updated.strftime('%d/%m/%Y %H:%M:%S')
                ])

            return response
            
        except Exception as e:
            return Response(
                {'detail': f'Erro ao exportar dados: {str(e)}'},
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
            required_headers = {'Descrição', 'Tipo', 'Sigla', 'Grupo', 'Operador', 'Valor'}
            headers = set(reader.fieldnames) if reader.fieldnames else set()
            if not required_headers.issubset(headers):
                return Response(
                    {'error': f'Cabeçalhos obrigatórios faltando. Necessários: {required_headers}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            success_count = 0
            error_rows = []
            
            company_id = request.user.company.company_id

            # Mapas de conversão
            type_map = {
                'Imposto': 'tax',
                'Taxa': 'fee'
            }
            
            group_map = {
                'Federal': 'federal',
                'Estadual': 'state',
                'Municipal': 'municipal',
                'Outro': 'other'
            }
            
            operator_map = {
                'Percentual': '%',
                'Fixo': '0',
                'Adição': '+',
                'Subtração': '-',
                'Multiplicação': '*',
                'Divisão': '/'
            }

            for row in reader:
                try:
                    # Validar campos obrigatórios
                    description = row.get('Descrição', '').strip()
                    acronym = row.get('Sigla', '').strip()
                    tipo = row.get('Tipo', '').strip()
                    grupo = row.get('Grupo', '').strip()
                    operador = row.get('Operador', '').strip()
                    
                    if not description:
                        raise ValidationError('Descrição é obrigatória')
                    
                    if not acronym:
                        raise ValidationError('Sigla é obrigatória')
                    
                    if not tipo:
                        raise ValidationError('Tipo é obrigatório')
                    
                    if not grupo:
                        raise ValidationError('Grupo é obrigatório')
                    
                    if not operador:
                        raise ValidationError('Operador é obrigatório')
                    
                    # Converter valor para decimal
                    try:
                        valor_str = row.get('Valor', '0').strip().replace(',', '.')
                        valor = float(valor_str)
                    except ValueError:
                        raise ValidationError('Valor inválido')
                    
                    # Mapear valores para códigos internos
                    tipo_code = type_map.get(tipo)
                    if not tipo_code:
                        raise ValidationError(f'Tipo inválido: {tipo}')
                        
                    grupo_code = group_map.get(grupo)
                    if not grupo_code:
                        raise ValidationError(f'Grupo inválido: {grupo}')
                        
                    operador_code = operator_map.get(operador)
                    if not operador_code:
                        raise ValidationError(f'Operador inválido: {operador}')
                    
                    # Preparar dados
                    tax_data = {
                        'description': description,
                        'acronym': acronym,
                        'type': tipo_code,
                        'group': grupo_code,
                        'calc_operator': operador_code,
                        'value': valor,
                        'company_id': company_id  # company_id é o código da empresa
                    }
                    
                    # Verificar existência (pela sigla e empresa)
                    existing_tax = Tax.objects.filter(
                        acronym=acronym,
                        company__company_id=company_id,
                        enabled=True
                    ).first()
                    
                    if existing_tax:
                        # Atualizar existente
                        for key, value in tax_data.items():
                            if key != 'company_id':  # Não permite alterar company_id
                                setattr(existing_tax, key, value)
                        existing_tax.save()
                    else:
                        # Criar novo
                        Tax.objects.create(**tax_data)
                    
                    success_count += 1
                    
                except Exception as e:
                    error_rows.append({
                        'row': row,
                        'error': str(e)
                    })

            message = f'{success_count} impostos importados com sucesso.'
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