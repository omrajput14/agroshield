from __future__ import annotations
"""Farm schemas for API responses and creation."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict
from .sensor import SensorReadingResponse


class FarmBase(BaseModel):
    name: str
    location: str
    latitude: float | None = None
    longitude: float | None = None
    area_acres: float
    variety: str | None = None
    owner_id: int | None = None


class FarmThresholds(BaseModel):
    threshold_deploy: float
    threshold_warning: float
    threshold_critical: float


class FarmCreate(FarmBase, FarmThresholds):
    pass


class FarmUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    area_acres: float | None = None
    variety: str | None = None
    threshold_deploy: float | None = None
    threshold_warning: float | None = None
    threshold_critical: float | None = None


class FarmResponse(FarmBase, FarmThresholds):
    id: int
    net_status: str
    risk_level: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FarmDetailResponse(FarmResponse):
    sensors: SensorReadingResponse | None = None
