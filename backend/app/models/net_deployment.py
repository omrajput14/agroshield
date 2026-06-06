"""NetDeployment model — history of windbreak net deploy/retract actions."""

import enum
from datetime import datetime, timezone

from sqlalchemy import Column, Integer, Float, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import relationship
from app.database import Base


class DeployAction(str, enum.Enum):
    deployed = "deployed"
    retracted = "retracted"


class DeployTrigger(str, enum.Enum):
    auto = "auto"
    manual = "manual"


class NetDeployment(Base):
    __tablename__ = "net_deployments"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)
    action = Column(Enum(DeployAction), nullable=False)
    trigger = Column(Enum(DeployTrigger), default=DeployTrigger.auto, nullable=False)
    wind_speed_at_trigger = Column(Float, nullable=True)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farm = relationship("Farm", back_populates="net_deployments")

    def __repr__(self):
        return f"<NetDeployment {self.action.value} farm={self.farm_id}>"
