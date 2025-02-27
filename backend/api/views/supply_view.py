
# backend/api/views/supply.py
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
import io
from datetime import datetime
import pandas as pd
from ..models import Supply
from ..serializers import SupplySerializer
from .base_view import BaseViewSet

class SupplyViewSet(BaseViewSet):
    """ViewSet for managing supplies"""
    queryset = Supply.objects.filter(enabled=True)
    serializer_class = SupplySerializer

    @action(detail=False, methods=['GET'])
    def export(self, request):
        """Export supplies to CSV"""
        try:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f'insumos_{timestamp}.csv'
            
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
            
            if filename.endswith('.csv'):
                df = pd.read_csv(file, encoding='utf-8-sig', sep=';')
            elif filename.endswith(('.xls', '.xlsx')):
                df = pd.read_excel(file)
            else:
                return Response(
                    {'error': 'Formato de arquivo não suportado. Use CSV, XLS ou XLSX.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            required_columns = {'Nome', 'Unidade de Medida', 'Tipo'}
            if not required_columns.issubset(set(df.columns)):
                return Response(
                    {'error': f'Colunas obrigatórias faltando. Necessárias: {required_columns}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            success_count = 0
            error_rows = []

            unit_measure_map = {
                'Unidade': 'UN',
                'Kilograma': 'KG',
                'Mililitro': 'ML'
            }
            
            type_map = {
                'Veículo': 'VEI',
                'Armamento': 'ARM',
                'Material': 'MAT',
                'Uniforme': 'UNI'
            }

            for index, row in df.iterrows():
                try:
                    supply_data = {
                        'name': str(row['Nome']).strip(),
                        'unit_measure': unit_measure_map.get(row['Unidade de Medida'], 'UN'),
                        'type': type_map.get(row['Tipo'], 'MAT')
                    }

                    if 'Apelido' in df.columns and pd.notna(row['Apelido']):
                        supply_data['nick_name'] = str(row['Apelido']).strip()
                    
                    if 'Código EAN' in df.columns and pd.notna(row['Código EAN']):
                        supply_data['ean_code'] = str(row['Código EAN']).strip()
                    
                    if 'Descrição' in df.columns and pd.notna(row['Descrição']):
                        supply_data['description'] = str(row['Descrição']).strip()

                    if not supply_data['name']:
                        raise ValueError('Nome é obrigatório')

                    existing_supply = None
                    if 'ean_code' in supply_data and supply_data['ean_code']:
                        existing_supply = Supply.objects.filter(
                            ean_code=supply_data['ean_code'],
                            enabled=True
                        ).first()

                    if existing_supply:
                        for key, value in supply_data.items():
                            setattr(existing_supply, key, value)
                        existing_supply.save()
                    else:
                        Supply.objects.create(**supply_data)

                    success_count += 1

                except Exception as e:
                    error_rows.append({
                        'row': index + 2,
                        'data': row.to_dict(),
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
