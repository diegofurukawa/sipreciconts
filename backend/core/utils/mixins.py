# core/utils/mixins.py
from rest_framework import status
from rest_framework.response import Response
from django.db import transaction
from django.core.exceptions import ValidationError
from django.db.models import ProtectedError

class BaseViewSetMixin:
    """
    Mixin base para ViewSets com funcionalidades comuns
    """
    
    def get_queryset(self):
        """
        Sobrescreve o queryset para incluir apenas registros ativos por padrão
        """
        queryset = super().get_queryset()
        # Se o modelo tem o campo enabled, filtra por ele
        if hasattr(queryset.model, 'enabled'):
            return queryset.filter(enabled=True)
        return queryset

    def destroy(self, request, *args, **kwargs):
        """
        Implementa soft delete quando disponível, caso contrário faz delete normal
        """
        try:
            instance = self.get_object()
            with transaction.atomic():
                if hasattr(instance, 'enabled'):
                    instance.enabled = False
                    instance.save()
                else:
                    instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ProtectedError:
            return Response(
                {"detail": "Este registro não pode ser excluído pois está em uso."},
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": "Erro ao excluir registro."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        """
        Sobrescreve o método de criação para adicionar dados do usuário
        """
        try:
            with transaction.atomic():
                if hasattr(serializer.Meta.model, 'created_by'):
                    serializer.save(created_by=self.request.user)
                else:
                    serializer.save()
        except ValidationError as e:
            raise ValidationError(str(e))

    def perform_update(self, serializer):
        """
        Sobrescreve o método de atualização para adicionar dados do usuário
        """
        try:
            with transaction.atomic():
                if hasattr(serializer.Meta.model, 'updated_by'):
                    serializer.save(updated_by=self.request.user)
                else:
                    serializer.save()
        except ValidationError as e:
            raise ValidationError(str(e))

    def handle_exception(self, exc):
        """
        Tratamento global de exceções
        """
        if isinstance(exc, ValidationError):
            return Response(
                {"detail": str(exc)},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().handle_exception(exc)