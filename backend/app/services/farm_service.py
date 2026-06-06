"""Farm logic service."""

from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.farm import Farm

def get_farm_or_404(db: Session, farm_id: int) -> Farm:
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm
