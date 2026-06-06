"""Risk engine for calculating wind risk levels and triggering net deployments."""

from sqlalchemy.orm import Session
from app.models.farm import Farm, RiskLevel, NetStatus
from app.models.sensor_reading import SensorReading
from app.models.event import Event, EventType, EventSeverity
from app.models.net_deployment import NetDeployment, DeployAction, DeployTrigger
from app.models.user import User
from app.services.notification_service import send_sms


def calculate_risk_level(wind_speed: float, farm: Farm) -> RiskLevel:
    if wind_speed >= farm.threshold_critical:
        return RiskLevel.severe
    elif wind_speed >= farm.threshold_deploy:
        return RiskLevel.high
    elif wind_speed >= farm.threshold_warning:
        return RiskLevel.moderate
    else:
        return RiskLevel.safe


def process_sensor_reading(db: Session, farm: Farm, reading: SensorReading):
    """Process a new sensor reading, update risk level, and auto-deploy nets if needed."""
    
    # Calculate new risk level based on current wind speed
    new_risk = calculate_risk_level(reading.wind_speed, farm)
    
    risk_changed = farm.risk_level != new_risk
    farm.risk_level = new_risk

    # Auto-deploy logic
    if new_risk in [RiskLevel.high, RiskLevel.severe] and farm.net_status == NetStatus.retracted:
        farm.net_status = NetStatus.deploying
        
        # Log the deployment
        deployment = NetDeployment(
            farm_id=farm.id,
            action=DeployAction.deployed,
            trigger=DeployTrigger.auto,
            wind_speed_at_trigger=reading.wind_speed,
            notes=f"Auto-deployed due to wind speed {reading.wind_speed} km/h exceeding threshold {farm.threshold_deploy} km/h"
        )
        db.add(deployment)
        
        # Create an event
        event = Event(
            farm_id=farm.id,
            type=EventType.deployment,
            severity=EventSeverity.warning,
            message=f"Windbreak nets auto-deployed — wind speed exceeded {farm.threshold_deploy} km/h threshold"
        )
        db.add(event)
        
        # Send SMS Notification
        owner = db.query(User).filter(User.id == farm.owner_id).first()
        if owner and owner.phone:
            msg = f"AGROSHIELD ALERT: Windbreak nets AUTO-DEPLOYED at {farm.name}. Wind speeds reached {reading.wind_speed} km/h."
            send_sms(owner.phone, msg)
    
    # Create alert event if risk escalated
    elif risk_changed and new_risk == RiskLevel.severe:
        event = Event(
            farm_id=farm.id,
            type=EventType.alert,
            severity=EventSeverity.critical,
            message=f"SEVERE WIND ALERT — Wind speed reached {reading.wind_speed} km/h. Immediate action required."
        )
        db.add(event)
        
        # Send SMS Notification
        owner = db.query(User).filter(User.id == farm.owner_id).first()
        if owner and owner.phone:
            msg = f"AGROSHIELD CRITICAL: SEVERE WIND ALERT at {farm.name}. Wind speed is {reading.wind_speed} km/h. Check dashboard immediately."
            send_sms(owner.phone, msg)
        
    db.commit()
