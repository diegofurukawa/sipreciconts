# api/models/base.py

from django.db import models
from django.db.models.base import ModelBase

class BaseModelMetaclass(ModelBase):
    """
    Metaclasse para personalizar o nome do campo ID
    """
    def __new__(cls, name, bases, attrs):
        # Só executa para subclasses de BaseModel
        if name != 'BaseModel':
            # Obtém o nome da tabela a partir do nome da classe
            table_name = name.lower()
            # Define o nome do campo ID (ex: customer_id para a classe Customer)
            id_field_name = f"{table_name}_id"
            
            # Cria o campo ID com nome personalizado
            attrs[id_field_name] = models.BigAutoField(
                primary_key=True,
                editable=False
            )

        return super().__new__(cls, name, bases, attrs)

class BaseModel(models.Model, metaclass=BaseModelMetaclass):
    """
    Modelo base abstrato para todos os modelos do projeto
    """
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
        app_label = 'api'  # Precisa especificar o app_label aqui
        ordering = ['-id']

    def soft_delete(self):
        """
        Método para realizar exclusão lógica
        """
        self.enabled = False
        self.save()