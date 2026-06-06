"""Windbreak net deployment router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.farm import Farm, NetStatus
from app.models.net_deployment import NetDeployment, DeployAction, DeployTrigger
from app.models.event import Event, EventType, EventSeverity
from app.services.auth_service import get_current_active_user, require_manager
from app.services.farm_service import get_farm_or_404

router = APIRouter(prefix="/api/farms/{farm_id}/nets", tags=["nets"])


@router.post("/deploy")
def deploy_nets(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_manager),
):
    farm = get_farm_or_404(db, farm_id)
    
    if farm.net_status == NetStatus.deployed:
        raise HTTPException(status_code=400, detail="Nets are already deployed")
        
    farm.net_status = NetStatus.deploying
    
    # Log the deployment
    deployment = NetDeployment(
        farm_id=farm.id,
        action=DeployAction.deployed,
        trigger=DeployTrigger.manual,
        notes=f"Manually deployed by {current_user.name}"
    )
    db.add(deployment)
    
    # Create an event
    event = Event(
        farm_id=farm.id,
        type=EventType.deployment,
        severity=EventSeverity.info,
        message=f"Manual net deployment initiated by user {current_user.name}"
    )
    db.add(event)
    
    db.commit()
    db.refresh(farm)
    
    # In a real app, we would send an MQTT command to the hardware here
    
    return {"message": "Net deployment initiated", "status": farm.net_status.value}


@router.post("/retract")
def retract_nets(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_manager),
):
    farm = get_farm_or_404(db, farm_id)
    
    if farm.net_status == NetStatus.retracted:
        raise HTTPException(status_code=400, detail="Nets are already retracted")
        
    farm.net_status = NetStatus.retracted
    
    # Log the retraction
    deployment = NetDeployment(
        farm_id=farm.id,
        action=DeployAction.retracted,
        trigger=DeployTrigger.manual,
        notes=f"Manually retracted by {current_user.name}"
    )
    db.add(deployment)
    
    # Create an event
    event = Event(
        farm_id=farm.id,
        type=EventType.deployment,
        severity=EventSeverity.info,
        message=f"Manual net retraction initiated by user {current_user.name}"
    )
    db.add(event)
    
    db.commit()
    db.refresh(farm)
    
    # In a real app, we would send an MQTT command to the hardware here
    
    return {"message": "Net retraction initiated", "status": farm.net_status.value}
