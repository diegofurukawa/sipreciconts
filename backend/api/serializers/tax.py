# api/serializers/tax.py

from rest_framework import serializers
from api.models import Tax

class TaxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tax
        fields = [
            'tax_id',
            'description',
            'type',
            'acronym',
            'group',
            'calc_operator',
            'value',
            'created',
            'updated',
            'enabled'
        ]