# api/serializers/__init__.py

from .customer import CustomerSerializer
from .tax import TaxSerializer
from .supply import SupplySerializer
from .asset_serializer import AssetSerializer
from .asset_group_serializer import AssetGroupSerializer
from .asset_category_serializer import AssetCategorySerializer
from .asset_movement_serializer import AssetMovementSerializer

__all__ = [
    'BaseSerializer',
    'CustomerSerializer',
    'CustomerTypeSerializer',
    'TaxSerializer',
    'SupplySerializer',

    'AssetSerializer',
    'AssetGroupSerializer',
    'AssetCategorySerializer',
    'AssetMovementSerializer',
]