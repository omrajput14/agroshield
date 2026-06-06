"""Sensors router."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from app.database import get_db
from app.models.farm import Farm
from app.models.sensor_reading import SensorReading
from app.schemas.sensor import SensorReadingCreate, SensorReadingResponse
from app.services.auth_service import get_current_active_user
from app.services.farm_service import get_farm_or_404
from app.services.risk_engine import process_sensor_reading

router = APIRouter(prefix="/api/farms/{farm_id}/sensors", tags=["sensors"])


@router.get("", response_model=list[SensorReadingResponse])
def get_sensor_history(
    farm_id: int,
    hours: int = 24,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    get_farm_or_404(db, farm_id)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=hours)
    
    readings = (
        db.query(SensorReading)
        .filter(SensorReading.farm_id == farm_id)
        .filter(SensorReading.recorded_at >= cutoff)
        .order_by(SensorReading.recorded_at.desc())
        .all()
    )
    return readings


@router.get("/latest", response_model=SensorReadingResponse)
def get_latest_sensor(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    get_farm_or_404(db, farm_id)
    reading = (
        db.query(SensorReading)
        .filter(SensorReading.farm_id == farm_id)
        .order_by(SensorReading.recorded_at.desc())
        .first()
    )
    return reading


@router.post("", response_model=SensorReadingResponse)
def create_sensor_reading(
    farm_id: int,
    reading_in: SensorReadingCreate,
    db: Session = Depends(get_db),
    # Note: In production, IoT devices would use a separate auth mechanism (like API keys or MQTT)
    # We leave this open or use a simple API key for the hardware to post data
):
    farm = get_farm_or_404(db, farm_id)
    
    new_reading = SensorReading(
        farm_id=farm_id,
        **reading_in.model_dump()
    )
    db.add(new_reading)
    
    # Process risk and auto-deployment
    process_sensor_reading(db, farm, new_reading)
    
    db.commit()
    db.refresh(new_reading)
    return new_reading
