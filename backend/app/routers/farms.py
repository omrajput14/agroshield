"""Farms router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm
from app.models.user import User
from app.schemas.farm import FarmDetailResponse, FarmCreate, FarmUpdate, FarmResponse
from app.services.auth_service import get_current_active_user, require_admin, require_manager
from app.services.farm_service import get_farm_or_404

router = APIRouter(prefix="/api/farms", tags=["farms"])


@router.get("", response_model=list[FarmDetailResponse])
def get_farms(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    farms = db.query(Farm).all()
    
    # Attach latest sensor reading to each farm for the dashboard
    result = []
    for farm in farms:
        farm_dict = {
            "id": farm.id,
            "name": farm.name,
            "location": farm.location,
            "latitude": farm.latitude,
            "longitude": farm.longitude,
            "area_acres": farm.area_acres,
            "variety": farm.variety,
            "owner_id": farm.owner_id,
            "net_status": farm.net_status.value,
            "risk_level": farm.risk_level.value,
            "threshold_deploy": farm.threshold_deploy,
            "threshold_warning": farm.threshold_warning,
            "threshold_critical": farm.threshold_critical,
            "created_at": farm.created_at,
            "updated_at": farm.updated_at,
            "sensors": farm.sensor_readings[0] if farm.sensor_readings else None
        }
        result.append(farm_dict)
        
    return result


@router.get("/{farm_id}", response_model=FarmDetailResponse)
def get_farm(farm_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    farm = get_farm_or_404(db, farm_id)
    farm_dict = {
        "id": farm.id,
        "name": farm.name,
        "location": farm.location,
        "latitude": farm.latitude,
        "longitude": farm.longitude,
        "area_acres": farm.area_acres,
        "variety": farm.variety,
        "owner_id": farm.owner_id,
        "net_status": farm.net_status.value,
        "risk_level": farm.risk_level.value,
        "threshold_deploy": farm.threshold_deploy,
        "threshold_warning": farm.threshold_warning,
        "threshold_critical": farm.threshold_critical,
        "created_at": farm.created_at,
        "updated_at": farm.updated_at,
        "sensors": farm.sensor_readings[0] if farm.sensor_readings else None
    }
    return farm_dict


@router.post("", response_model=FarmResponse)
def create_farm(
    farm_in: FarmCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_admin)
):
    farm = Farm(**farm_in.model_dump())
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm


@router.put("/{farm_id}", response_model=FarmResponse)
def update_farm(
    farm_id: int, 
    farm_in: FarmUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(require_manager)
):
    farm = get_farm_or_404(db, farm_id)
    
    update_data = farm_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(farm, field, value)
        
    db.commit()
    db.refresh(farm)
    return farm
