# api/models/types.py

from django.db import models

class CustomerType(models.TextChoices):
    INDIVIDUAL = 'individual', 'Individual'
    BUSINESS = 'business', 'Empresarial'
    # outros tipos se necessário

# Adicionar junto com o CustomerType existente
class TaxType(models.TextChoices):
    TAX = 'tax', 'Imposto'
    FEE = 'fee', 'Taxa'

class TaxGroup(models.TextChoices):
    FEDERAL = 'federal', 'Federal'
    STATE = 'state', 'Estadual'
    MUNICIPAL = 'municipal', 'Municipal'
    OTHER = 'other', 'Outro'

class CalcOperator(models.TextChoices):
    PERCENTAGE = '%', 'Percentual'
    FIXED = '0', 'Fixo'
    ADDITION = '+', 'Adição'
    SUBTRACTION = '-', 'Subtração'
    MULTIPLICATION = '*', 'Multiplicação'
    DIVISION = '/', 'Divisão'