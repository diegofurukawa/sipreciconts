from jsonschema import ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
import io
from datetime import datetime
import re
import pandas as pd
from ..models import Supply
from ..serializers import SupplySerializer
from .base_view import BaseViewSet
from rest_framework import viewsets, status, filters
from rest_framework.permissions import IsAuthenticated

class SupplyViewSet(BaseViewSet):
    queryset = Supply.objects.filter(enabled=True)
    serializer_class = SupplySerializer

    permission_classes = [IsAuthenticated]
    lookup_field = 'supply_id'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'nick_name', 'ean_code', 'description']  # Campos para busca
    ordering_fields = ['name', 'created', 'updated']
    ordering = ['name']

    def get_queryset(self):
        """
        Retorna queryset filtrado por company e enabled
        """
        if not self.request.user.company:
            return Supply.objects.none()
            
        return Supply.objects.filter(
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

    @action(detail=False, methods=['GET'])
    def export(self, request):
        """Export supplies to CSV"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            company_name = request.user.company.name.lower().replace(' ', '_')
            filename = f'insumos_{company_name}_{timestamp}.csv'
            
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
                'Apelido',
                'Código EAN',
                'Descrição',
                'Unidade de Medida',
                'Tipo',
                'Data de Cadastro',
                'Última Atualização'
            ])

            supplies = self.get_queryset()
            for supply in supplies:
                writer.writerow([
                    supply.name,
                    supply.nick_name or '',
                    supply.ean_code or '',
                    supply.description or '',
                    supply.get_unit_measure_display(),
                    supply.get_type_display(),
                    supply.created.strftime('%d/%m/%Y %H:%M:%S'),
                    supply.updated.strftime('%d/%m/%Y %H:%M:%S')
                ])

            return response

        except Exception as e:
            return Response(
                {'error': f'Erro ao exportar dados: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['POST'])
    def import_supplies(self, request):
        """Import supplies from CSV/XLS/XLSX file"""
        try:
            if 'file' not in request.FILES:
                return Response(
                    {'error': 'Nenhum arquivo foi enviado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file = request.FILES['file']
            filename = file.name.lower()
            
            # Determinar formato e ler arquivo
            if filename.endswith('.csv'):
                try:
                    decoded_file = file.read().decode('utf-8-sig')
                    io_string = io.StringIO(decoded_file)
                    reader = csv.DictReader(io_string, delimiter=';')
                    rows = list(reader)
                except Exception as e:
                    return Response(
                        {'error': f'Erro ao ler arquivo CSV: {str(e)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            elif filename.endswith(('.xls', '.xlsx')):
                try:
                    df = pd.read_excel(file)
                    rows = df.to_dict('records')
                except Exception as e:
                    return Response(
                        {'error': f'Erro ao ler arquivo Excel: {str(e)}'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {'error': 'Formato de arquivo não suportado. Use CSV, XLS ou XLSX.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verificar cabeçalhos obrigatórios
            required_fields = {'Nome', 'Unidade de Medida', 'Tipo'}
            if not all(field in rows[0].keys() for field in required_fields):
                return Response(
                    {'error': f'Colunas obrigatórias faltando. Necessárias: {required_fields}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            success_count = 0
            error_rows = []

            # Mapas para conversão de valores
            unit_measure_map = {
                # About Quantity
                'Unidade': 'UN',

                # About Capacity
                'Kilograma': 'KG', 
                'Mililitro': 'ML', 
                'Litro': 'L',
                'Metro Cubico': 'M3',

                # About Distance
                'Metro': 'M',
                'Kilometros': 'KM',

                # About Area        
                'Metro Quadrado': 'M2',

                # About Time
                'Dia': 'DAY',
                'Hora': 'HR',
                'Mês': 'MON',
                'Ano': 'YEAR'
            }
            
            type_map = {
                'Veículo': 'VEI',
                'Armamento': 'ARM',
                'Material': 'MAT',
                'Uniforme': 'UNI',
                'Equipamento': 'EQUIP',
                'Serviço': 'SERV',
                'Mão de Obra': 'MAO'
            }

            company_id = self.request.user.company.company_id

            for index, row in enumerate(rows):
                try:
                    # Limpar e validar dados
                    name = str(row.get('Nome', '')).strip()
                    if not name:
                        raise ValidationError('Nome é obrigatório')
                    
                    # Preparar dados
                    supply_data = {
                        'name': name,
                        'unit_measure': unit_measure_map.get(row.get('Unidade de Medida', ''), 'UN'),
                        'type': type_map.get(row.get('Tipo', ''), 'MAT'),
                        'company_id': company_id  # company_id é o código da empresa
                    }

                    # Adicionar campos opcionais se existirem
                    if row.get('Apelido'):
                        supply_data['nick_name'] = str(row.get('Apelido')).strip()
                    
                    if row.get('Código EAN'):
                        supply_data['ean_code'] = str(row.get('Código EAN')).strip()
                    
                    if row.get('Descrição'):
                        supply_data['description'] = str(row.get('Descrição')).strip()

                    # Verificar existência pelo código EAN
                    existing_supply = None
                    if 'ean_code' in supply_data and supply_data['ean_code']:
                        existing_supply = Supply.objects.filter(
                            ean_code=supply_data['ean_code'],
                            company__company_id=company_id,
                            enabled=True
                        ).first()

                    if existing_supply:
                        # Atualizar existente
                        for key, value in supply_data.items():
                            if key != 'company_id':  # Não permite alterar company_id
                                setattr(existing_supply, key, value)
                        existing_supply.save()
                    else:
                        # Criar novo
                        Supply.objects.create(**supply_data)

                    success_count += 1

                except Exception as e:
                    error_rows.append({
                        'row': index + 2,  # +2 para contar cabeçalho e índice base 0
                        'data': row,
                        'error': str(e)
                    })

            message = f'{success_count} insumos importados com sucesso.'
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