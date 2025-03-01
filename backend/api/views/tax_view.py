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

# Adicionar junto com o CustomerViewSet
class TaxViewSet(viewsets.ModelViewSet):
    queryset = Tax.objects.filter(enabled=True)
    serializer_class = TaxSerializer

    def perform_create(self, serializer):
        """
        Sobrescreve criação para incluir company automaticamente
        """
        serializer.save(company=self.request.user.company)

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