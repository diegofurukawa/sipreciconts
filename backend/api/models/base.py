# api/models/base.py
from django.db import models
from django.db.models.base import ModelBase
from django.core.exceptions import ValidationError

class BaseModelMetaclass(ModelBase):
    """
    Metaclasse para personalizar o nome do campo ID e adicionar relacionamento com Company
    """
    def __new__(cls, name, bases, attrs):
        # Só executa para subclasses de BaseModel
        if name != 'BaseModel':
            # Obtém o nome da tabela a partir do nome da classe
            table_name = name.lower()
            
            # Tratamento especial para o modelo Company
            if name == 'Company':
                # Define company_id como CharField e PK
                attrs['company_id'] = models.CharField(
                    'Código da Empresa',
                    max_length=30,
                    primary_key=True,
                    help_text='Código único de identificação da empresa'
                )
            else:
                # Para outros modelos, cria o campo ID padrão
                id_field_name = f"{table_name}_id"
                attrs[id_field_name] = models.BigAutoField(
                    primary_key=True,
                    editable=False
                )
                
                # Adiciona o campo company como ForeignKey
                attrs['company'] = models.ForeignKey(
                    'api.Company',
                    on_delete=models.PROTECT,
                    verbose_name='Empresa',
                    to_field='company_id',  # Referencia o novo campo company_id
                    related_name=f'company_{table_name}s',
                    help_text='Empresa à qual este registro pertence'
                )
                
                # Adiciona índice composto para company e enabled
                if 'class Meta' not in attrs:
                    attrs['class Meta'] = type('Meta', (), {
                        'abstract': True,
                        'app_label': 'api',
                        'ordering': ['-id'] if name != 'Company' else ['company_id'],
                        'indexes': [
                            models.Index(fields=['company', 'enabled'])
                        ]
                    })
                else:
                    existing_meta = attrs['class Meta']
                    existing_indexes = getattr(existing_meta, 'indexes', [])
                    existing_indexes.append(models.Index(fields=['company', 'enabled']))
                    setattr(existing_meta, 'indexes', existing_indexes)

        return super().__new__(cls, name, bases, attrs)

class BaseModel(models.Model, metaclass=BaseModelMetaclass):
    """Modelo base abstrato para todos os modelos do projeto"""
    created = models.DateTimeField(
        'Data de Criação',
        auto_now_add=True,
        editable=False
    )
    updated = models.DateTimeField(
        'Última Atualização',
        auto_now=True,
        editable=False
    )
    enabled = models.BooleanField(
        'Ativo',
        default=True
    )

    class Meta:
        abstract = True
        app_label = 'api'

    def soft_delete(self):
        self.enabled = False
        self.save()

    def save(self, *args, **kwargs):
        if self.__class__.__name__ != 'Company':
            if not hasattr(self, 'company_id') or not self.company_id:
                raise ValidationError('O campo company é obrigatório')
            
            if hasattr(self, 'company') and self.company and not self.company.enabled:
                raise ValidationError('Não é possível criar/atualizar registros para uma empresa inativa')

        super().save(*args, **kwargs)

    @classmethod
    def get_company_queryset(cls, company_id):
        if cls.__name__ == 'Company':
            return cls.objects.filter(company_id=company_id, enabled=True)
        return cls.objects.filter(company_id=company_id, enabled=True)