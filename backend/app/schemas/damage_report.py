from __future__ import annotations
"""Damage report schemas for crop damage recording."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DamageReportBase(BaseModel):
    farm_id: int
    damage_type: str
    severity: str
    estimated_loss: float | None = 0.0
    description: str | None = None
    photo_count: int | None = 0


class DamageReportCreate(DamageReportBase):
    pass


class DamageReportUpdate(BaseModel):
    status: str
    severity: str | None = None
    estimated_loss: float | None = None


class DamageReportResponse(DamageReportBase):
    id: int
    reported_by: int | None = None
    status: str
    created_at: datetime
    farm_name: str | None = None

    model_config = ConfigDict(from_attributes=True)
