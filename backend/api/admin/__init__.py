# backend/api/admin/__init__.py
from .base import BaseAdmin
from .supply import SupplyAdmin
from .tax import TaxAdmin
from .customer import CustomerAdmin
# Registrar no admin.py principal
# apps/assets/admin/__init__.py
from .assets import AssetAdmin, AssetGroupAdmin, AssetCategoryAdmin, AssetMovementAdmin
from .company import CompanyAdmin
from .user import UserAdmin

__all__ = [
    'BaseAdmin', 
    'CompanyAdmin',
    'UserAdmin',

    #'CustomUserAdmin', 

    'CustomerAdmin',
    
    'TaxAdmin',
    
    'SupplyAdmin',

    'AssetAdmin',
    'AssetGroupAdmin',
    'AssetCategoryAdmin',
    'AssetMovementAdmin',
    ]