# api/serializers/__init__.py

from .customer import CustomerSerializer
from .tax import TaxSerializer
from .supply import SupplySerializer
from .asset import AssetSerializer
from .asset_group import AssetGroupSerializer
from .asset_category import AssetCategorySerializer
from .asset_movement import AssetMovementSerializer
from .company import CompanySerializer, CompanyDetailSerializer, CompanyListSerializer
from .user import UserSerializer


__all__ = [
    #Base
    'BaseSerializer',
    
    #Companys
    'CompanySerializer',
    'CompanyListSerializer',
    'CompanyDetailSerializer',

    #User
    'UserSerializer',

    #Tax
    'TaxSerializer',

    #Customer
    'CustomerSerializer',
    'CustomerTypeSerializer',

    #Supply
    'SupplySerializer',

    #Asset
    'AssetSerializer',
    'AssetGroupSerializer',
    'AssetCategorySerializer',
    'AssetMovementSerializer',
]