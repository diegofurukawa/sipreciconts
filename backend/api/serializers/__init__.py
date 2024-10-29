# api/serializers/__init__.py

from .customer import CustomerSerializer
from .tax import TaxSerializer
from .supply import SupplySerializer
from .asset import AssetSerializer
from .asset_group import AssetGroupSerializer
from .asset_category import AssetCategorySerializer
from .asset_movement import AssetMovementSerializer
from .company import CompanySerializer, CompanyDetailSerializer, CompanyListSerializer

__all__ = [
    'BaseSerializer',
    
    #Companys
    'CompanySerializer',
    'CompanyListSerializer',
    'CompanyDetailSerializer',

    'TaxSerializer',
    'CustomerSerializer',
    'CustomerTypeSerializer',

    'SupplySerializer',

    'AssetSerializer',
    'AssetGroupSerializer',
    'AssetCategorySerializer',
    'AssetMovementSerializer',
]