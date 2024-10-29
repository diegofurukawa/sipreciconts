# backend/api/views/__init__.py
from .base import BaseViewSet
from .supply import SupplyViewSet
from .customer import CustomerViewSet
from .tax import TaxViewSet
from .asset_views import AssetViewSet
from .asset_group_views import AssetGroupViewSet
from .asset_category_views import AssetCategoryViewSet
from .asset_movement_views import AssetMovementViewSet

__all__ = [
    'BaseViewSet', 
    'SupplyViewSet',
    'CustomerViewSet',
    'TaxViewSet',

    'AssetViewSet',
    'AssetGroupViewSet',
    'AssetCategoryViewSet',
    'AssetMovementViewSet',
]