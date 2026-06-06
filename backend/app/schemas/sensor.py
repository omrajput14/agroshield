from __future__ import annotations
"""Sensor schemas for reading and creating sensor data."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class SensorReadingBase(BaseModel):
    wind_speed: float
    wind_direction: str | None = None
    wind_gust: float | None = None
    temperature: float | None = None
    humidity: float | None = None
    rainfall: float | None = None
    soil_moisture: float | None = None
    pressure: float | None = None
    battery_level: float | None = None
    solar_output: float | None = None


class SensorReadingCreate(SensorReadingBase):
    pass


class SensorReadingResponse(SensorReadingBase):
    id: int
    farm_id: int
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
