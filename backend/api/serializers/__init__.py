# api/serializers/__init__.py

from .base_serializer import BaseSerializer
from .company_serializer import (
    UserMinimalSerializer,
    CompanyListSerializer,
    CompanyDetailSerializer,
    CompanyCreateSerializer,
    CompanyUpdateSerializer,
    CompanyMemberManagementSerializer,
    CompanyBasicSerializer,
    CompanySerializer
)
from .customer_serializer import CustomerSerializer
from .tax_serializer import TaxSerializer
from .supply_serializer import SupplySerializer
from .asset_serializer import AssetSerializer
from .asset_group_serializer import AssetGroupSerializer
from .asset_category_serializer import AssetCategorySerializer
from .asset_movement_serializer import AssetMovementSerializer
from .user_serializer import UserSerializer
from .usersession_serializer import UserSessionSerializer
from .auth_serializer import LoginSerializer
from .supplies_price_list_serializer import SuppliesPriceListSerializer
# from .contract import ContractSerializer, ContractDetailSerializer, ContractListSerializer
# from .quote import QuoteSerializer, QuoteDetailSerializer, QuoteListSerializer

__all__ = [
    # Base
    'BaseSerializer',
    
    # Company
    'UserMinimalSerializer',
    'CompanyListSerializer',
    'CompanyDetailSerializer',
    'CompanyCreateSerializer',
    'CompanyUpdateSerializer',
    'CompanyMemberManagementSerializer',
    'CompanyBasicSerializer',
    'CompanySerializer',

    # User
    'UserSerializer',
    'UserSessionSerializer',
    
    #Login
    'LoginSerializer',

    # Tax
    'TaxSerializer',

    # Customer
    'CustomerSerializer',
    'CustomerTypeSerializer',

    # Supply
    'SupplySerializer',
    'SuppliesPriceListSerializer',

    # Asset
    'AssetSerializer',
    'AssetGroupSerializer',
    'AssetCategorySerializer',
    'AssetMovementSerializer',

    # # Contract
    # 'ContractSerializer',
    # 'ContractDetailSerializer',
    # 'ContractListSerializer',

    # # Quote
    # 'QuoteSerializer',
    # 'QuoteDetailSerializer',
    # 'QuoteListSerializer',
]