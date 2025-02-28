# backend/api/admin/__init__.py
from .base_admin import BaseAdmin
from .supply_admin import SupplyAdmin
from .tax_admin import TaxAdmin
from .customer_admin import CustomerAdmin
# Registrar no admin.py principal
# apps/assets/admin/__init__.py
from .assets_admin import AssetAdmin, AssetGroupAdmin, AssetCategoryAdmin, AssetMovementAdmin, Asset
from .company_admin import CompanyAdmin
from .user_admin import UserAdmin
from .location_admin import LocationAdmin
from .asset_location_admin import AssetLocationAdmin, AssetLocation
from .usersession_admin import UserSessionAdmin

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