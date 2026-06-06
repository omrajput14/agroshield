from __future__ import annotations
"""Event schemas for the event log and alerts."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    farm_id: int
    type: str
    severity: str
    message: str


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    id: int
    farm_name: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
