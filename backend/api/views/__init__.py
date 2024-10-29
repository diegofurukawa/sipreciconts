# backend/api/views/__init__.py
from .base import BaseViewSet
from .supply import SupplyViewSet
from .customer import CustomerViewSet
from .tax import TaxViewSet
from .asset import AssetViewSet
from .asset_group import AssetGroupViewSet
from .asset_category import AssetCategoryViewSet
from .asset_movement import AssetMovementViewSet
from .company import CompanyViewSet

__all__ = [
    'BaseViewSet',
    'CompanyViewSet',
    'SupplyViewSet',
    'CustomerViewSet',
    'TaxViewSet',

    'AssetViewSet',
    'AssetGroupViewSet',
    'AssetCategoryViewSet',
    'AssetMovementViewSet',
]