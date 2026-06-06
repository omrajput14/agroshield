"""SensorReading model — time-series IoT sensor data for each farm."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)

    # Wind data
    wind_speed = Column(Float, nullable=False, default=0.0)
    wind_direction = Column(String(10), nullable=True)
    wind_gust = Column(Float, nullable=True, default=0.0)

    # Environmental
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True, default=0.0)
    soil_moisture = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)

    # Power
    battery_level = Column(Float, nullable=True)
    solar_output = Column(Float, nullable=True)

    recorded_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationships
    farm = relationship("Farm", back_populates="sensor_readings")

    def __repr__(self):
        return f"<SensorReading farm={self.farm_id} wind={self.wind_speed}km/h @ {self.recorded_at}>"
