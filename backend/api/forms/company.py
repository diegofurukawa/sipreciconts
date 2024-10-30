# backend/api/forms.py
from django import forms
from ..models import Company

class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = '__all__'

    def clean_company_id(self):
        """
        Valida e formata o company_id
        """
        company_id = self.cleaned_data.get('company_id')
        if company_id:
            company_id = company_id.upper().strip()
            
            # Valida formato
            if not company_id.isalnum():
                raise forms.ValidationError(
                    'O código da empresa deve conter apenas letras e números'
                )
            
            # Verifica se já existe (exceto para o registro atual)
            exists = Company.objects.filter(company_id=company_id)
            if self.instance.pk:
                exists = exists.exclude(pk=self.instance.pk)
            
            if exists.exists():
                raise forms.ValidationError(
                    'Este código de empresa já está em uso'
                )
                
        return company_id

    def clean_document(self):
        """
        Limpa e valida o documento (CNPJ/CPF)
        """
        document = self.cleaned_data.get('document')
        if document:
            # Remove caracteres não numéricos
            document = ''.join(filter(str.isdigit, document))
            
            # Aqui você pode adicionar validação de CNPJ/CPF
            
        return document