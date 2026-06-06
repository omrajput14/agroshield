"""Forecasts router."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import math

from app.database import get_db
from app.services.auth_service import get_current_active_user

router = APIRouter(prefix="/api/forecasts", tags=["forecasts"])


@router.get("")
def get_forecasts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    # Mocking forecast data mathematically so it doesn't need a DB table
    hourly = []
    for i in range(24):
        hourly.append({
            "hour": i,
            "time": f"{str(i).zfill(2)}:00",
            "windSpeed": round((15 + math.sin(i / 4) * 20 + 5) * 10) / 10,
            "windGust": round((20 + math.sin(i / 4) * 25 + 7) * 10) / 10,
            "temperature": round((26 + math.sin((i - 6) / 4) * 6 + 1) * 10) / 10,
            "humidity": round(60 + math.sin(i / 6) * 20 + 5),
            "rainfall": round(4 * 10) / 10 if 14 < i < 20 else 0,
            "riskLevel": 'high' if 12 < i < 18 else ('moderate' if 10 < i < 20 else 'safe'),
        })

    daily = [
        {"day": "Mon", "maxWind": 35, "avgWind": 18, "maxGust": 48, "rainfall": 2.1, "risk": "moderate"},
        {"day": "Tue", "maxWind": 52, "avgWind": 28, "maxGust": 68, "rainfall": 8.4, "risk": "severe"},
        {"day": "Wed", "maxWind": 41, "avgWind": 24, "maxGust": 55, "rainfall": 5.2, "risk": "high"},
        {"day": "Thu", "maxWind": 22, "avgWind": 14, "maxGust": 30, "rainfall": 0.5, "risk": "safe"},
        {"day": "Fri", "maxWind": 18, "avgWind": 11, "maxGust": 24, "rainfall": 0, "risk": "safe"},
        {"day": "Sat", "maxWind": 28, "avgWind": 19, "maxGust": 38, "rainfall": 1.8, "risk": "moderate"},
        {"day": "Sun", "maxWind": 33, "avgWind": 21, "maxGust": 44, "rainfall": 3.1, "risk": "moderate"},
    ]

    return {
        "hourly": hourly,
        "daily": daily,
    }
