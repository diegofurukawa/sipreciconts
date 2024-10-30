# backend/api/admin/__init__.py
from .base import BaseAdmin
from .supply import SupplyAdmin
from .tax import TaxAdmin
from .customer import CustomerAdmin
# Registrar no admin.py principal
# apps/assets/admin/__init__.py
from .assets import AssetAdmin, AssetGroupAdmin, AssetCategoryAdmin, AssetMovementAdmin, Asset
from .company import CompanyAdmin
from .user import UserAdmin
from .location import LocationAdmin
from .asset_location import AssetLocationAdmin, AssetLocation

all__ = [
    'BaseAdmin', 
    'CompanyAdmin',
    'UserAdmin',

    #'CustomUserAdmin', 

    'CustomerAdmin',
    
    'TaxAdmin',
    
    'SupplyAdmin',
    
    'LocationAdmin', 

    'AssetAdmin',
    'AssetGroupAdmin',
    'AssetCategoryAdmin',
    'AssetMovementAdmin',
    'AssetLocationAdmin',
    ]