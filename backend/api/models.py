# backend/api/models.py
from django.db import models

class CustomerType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=200)
    document = models.CharField(max_length=20, unique=True, null=True, blank=True)
    customer_type = models.CharField(max_length=50, null=True, blank=True)
    celphone = models.CharField(max_length=20)
    email = models.EmailField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    complement = models.TextField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    enabled = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Resource(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Contract(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('active', 'Ativo'),
        ('completed', 'Concluído'),
        ('cancelled', 'Cancelado'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    value = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

