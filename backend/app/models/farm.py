"""Farm model — banana farm with location, thresholds, and net status."""

import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Enum, ForeignKey,
)
from sqlalchemy.orm import relationship
from app.database import Base


class NetStatus(str, enum.Enum):
    deployed = "deployed"
    retracted = "retracted"
    deploying = "deploying"


class RiskLevel(str, enum.Enum):
    safe = "safe"
    moderate = "moderate"
    high = "high"
    severe = "severe"


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    area_acres = Column(Float, nullable=False, default=0)
    variety = Column(String(100), nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    net_status = Column(Enum(NetStatus), default=NetStatus.retracted, nullable=False)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.safe, nullable=False)

    # Wind thresholds (km/h)
    threshold_deploy = Column(Float, default=35.0)
    threshold_warning = Column(Float, default=25.0)
    threshold_critical = Column(Float, default=45.0)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    owner = relationship("User", back_populates="farms")
    sensor_readings = relationship(
        "SensorReading", back_populates="farm", order_by="SensorReading.recorded_at.desc()"
    )
    events = relationship("Event", back_populates="farm", order_by="Event.created_at.desc()")
    damage_reports = relationship("DamageReport", back_populates="farm")
    net_deployments = relationship("NetDeployment", back_populates="farm")

    def __repr__(self):
        return f"<Farm {self.name} ({self.location})>"
