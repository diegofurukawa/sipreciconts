from rest_framework import serializers
from api.models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    company_id = serializers.CharField(source='company.company_id', read_only=True)
    customer_type = serializers.ChoiceField(
        choices=[
            ('individual', 'Individual'),
            ('business', 'Empresarial')
        ],
        required=False,
        allow_blank=True
    )
    
    class Meta:
        model = Customer
        fields = [
            'customer_id', 
            'name', 
            'document', 
            'customer_type',
            'celphone', 
            'email', 
            'address', 
            'complement',
            'company_id',
            'created',
            'updated',
            'enabled'
        ]
        read_only_fields = ['company_id', 'created', 'updated']

    def validate_document(self, value):
        if value:
            value = ''.join(filter(str.isdigit, value))
        return value

    def validate_celphone(self, value):
        if value:
            value = ''.join(filter(str.isdigit, value))
        return value