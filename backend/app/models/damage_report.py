"""DamageReport model — crop damage reports submitted by farmers."""

import enum
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Enum, ForeignKey, Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


class ReportStatus(str, enum.Enum):
    under_review = "under_review"
    approved = "approved"
    resolved = "resolved"


class DamageReport(Base):
    __tablename__ = "damage_reports"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=False, index=True)
    reported_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    damage_type = Column(String(100), nullable=False)
    severity = Column(String(20), nullable=False, default="moderate")
    estimated_loss = Column(Float, nullable=True, default=0.0)
    description = Column(Text, nullable=True)
    status = Column(
        Enum(ReportStatus), default=ReportStatus.under_review, nullable=False
    )
    photo_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farm = relationship("Farm", back_populates="damage_reports")
    reporter = relationship("User", back_populates="damage_reports")

    def __repr__(self):
        return f"<DamageReport farm={self.farm_id} loss=₹{self.estimated_loss}>"
