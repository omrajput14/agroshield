from __future__ import annotations
"""Events router."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.event import Event
from app.models.farm import Farm
from app.schemas.event import EventResponse, EventCreate
from app.services.auth_service import get_current_active_user

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("", response_model=list[EventResponse])
def get_events(
    skip: int = 0,
    limit: int = 50,
    farm_id: int | None = None,
    type: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    query = db.query(Event)
    
    if farm_id:
        query = query.filter(Event.farm_id == farm_id)
    if type:
        query = query.filter(Event.type == type)
        
    events = query.order_by(Event.created_at.desc()).offset(skip).limit(limit).all()
    
    # Inject farm name for the response
    for event in events:
        if event.farm:
            event.farm_name = event.farm.name
            
    return events


@router.post("", response_model=EventResponse)
def create_event(
    event_in: EventCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    event = Event(**event_in.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    
    if event.farm:
        event.farm_name = event.farm.name
        
    return event
