# api/models/base.py

from django.db import models

class BaseModel(models.Model):
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