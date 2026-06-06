"""Event model — system events, deployments, alerts, and sensor logs."""

import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class EventType(str, enum.Enum):
    deployment = "deployment"
    alert = "alert"
    sensor = "sensor"
    system = "system"


class EventSeverity(str, enum.Enum):
    critical = "critical"
    warning = "warning"
    info = "info"
    success = "success"


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)
    type = Column(Enum(EventType), nullable=False)
    severity = Column(Enum(EventSeverity), default=EventSeverity.info, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(
        DateTime, default=lambda: datetime.now(timezone.utc), index=True
    )

    # Relationships
    farm = relationship("Farm", back_populates="events")

    def __repr__(self):
        return f"<Event [{self.severity.value}] {self.type.value} @ {self.farm_id}>"
