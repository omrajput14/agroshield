"""Analytics router."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.farm import Farm
from app.models.sensor_reading import SensorReading
from app.models.net_deployment import NetDeployment
from app.models.event import Event, EventType
from app.schemas.analytics import AnalyticsResponse
from app.services.auth_service import get_current_active_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/dashboard", response_model=AnalyticsResponse)
def get_dashboard_analytics(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    # In a real app, these would be complex aggregations over the database.
    # For now, we return mock analytics that match the frontend.
    
    active_farms = db.query(Farm).count()
    total_deployments = db.query(NetDeployment).count()
    total_alerts = db.query(Event).filter(Event.type == EventType.alert).count()
    
    stats = {
        "total_deployments": total_deployments or 147,
        "deployments_this_month": 23,
        "avg_response_time": 4.2,
        "losses_prevented_estimate": 2850000,
        "uptime": 99.7,
        "active_farms": active_farms or 6,
        "total_sensors": (active_farms or 6) * 8,
        "alerts_sent": total_alerts or 312,
    }
    
    monthly_deployments = [
        {"month": "Jan", "deployments": 12, "losses": 45000, "prevented": 250000},
        {"month": "Feb", "deployments": 15, "losses": 30000, "prevented": 320000},
        {"month": "Mar", "deployments": 8, "losses": 15000, "prevented": 150000},
        {"month": "Apr", "deployments": 22, "losses": 85000, "prevented": 450000},
        {"month": "May", "deployments": 35, "losses": 120000, "prevented": 850000},
        {"month": "Jun", "deployments": 23, "losses": 40000, "prevented": 420000},
    ]
    
    risk_distribution = [
        {"name": "Safe (Wind < 25 km/h)", "value": 45, "color": "#10b981"},
        {"name": "Moderate (25-35 km/h)", "value": 30, "color": "#f59e0b"},
        {"name": "High Risk (35-45 km/h)", "value": 15, "color": "#f97316"},
        {"name": "Severe Risk (>45 km/h)", "value": 10, "color": "#ef4444"},
    ]
    
    return {
        "stats": stats,
        "monthly_deployments": monthly_deployments,
        "risk_distribution": risk_distribution,
    }
