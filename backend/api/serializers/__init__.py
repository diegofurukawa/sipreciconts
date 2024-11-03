# api/serializers/__init__.py

from .base import BaseSerializer
from .company import (
    UserMinimalSerializer,
    CompanyListSerializer,
    CompanyDetailSerializer,
    CompanyCreateSerializer,
    CompanyUpdateSerializer,
    CompanyMemberManagementSerializer,
    CompanyBasicSerializer,
    CompanySerializer
)
from .customer import CustomerSerializer, CustomerTypeSerializer
from .tax import TaxSerializer
from .supply import SupplySerializer
from .asset import AssetSerializer
from .asset_group import AssetGroupSerializer
from .asset_category import AssetCategorySerializer
from .asset_movement import AssetMovementSerializer
from .user import UserSerializer
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

    # Tax
    'TaxSerializer',

    # Customer
    'CustomerSerializer',
    'CustomerTypeSerializer',

    # Supply
    'SupplySerializer',

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