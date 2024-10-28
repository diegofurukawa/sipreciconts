# backend/api/admin.py
from django.contrib import admin
from .models import Resource, Contract, CustomerType, Customer

admin.site.register(Resource)
admin.site.register(Contract)
admin.site.register(CustomerType)
admin.site.register(Customer)