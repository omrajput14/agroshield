"""Predictions router."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.auth_service import get_current_active_user
from app.services.prediction_service import get_ai_predictions

router = APIRouter(prefix="/api/predictions", tags=["predictions"])


@router.get("")
def read_predictions(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    return get_ai_predictions(db)
