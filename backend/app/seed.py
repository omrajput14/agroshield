"""Database seeder to populate mock data."""

import sys
import os
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
from app.models.user import User, UserRole
from app.models.farm import Farm, NetStatus, RiskLevel
from app.models.sensor_reading import SensorReading
from app.models.event import Event, EventType, EventSeverity
from app.models.damage_report import DamageReport, ReportStatus
from app.services.auth_service import get_password_hash

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).first():
            print("Database already seeded. Skipping.")
            return

        print("Seeding Users...")
        admin = User(
            email="admin@agroshield.ai",
            name="System Admin",
            role=UserRole.admin,
            hashed_password=get_password_hash("password123")
        )
        manager = User(
            email="manager@agroshield.ai",
            name="District Manager",
            role=UserRole.farm_manager,
            hashed_password=get_password_hash("password123")
        )
        farmer = User(
            email="farmer@agroshield.ai",
            name="Rajesh Patil",
            role=UserRole.farmer,
            hashed_password=get_password_hash("password123")
        )
        db.add_all([admin, manager, farmer])
        db.commit()

        print("Seeding Farms...")
        farms_data = [
            {
                "name": 'Cavendish Valley Farm',
                "location": 'Jalgaon, Maharashtra',
                "latitude": 21.0077,
                "longitude": 75.5626,
                "area_acres": 45,
                "variety": 'Grand Naine',
                "owner_id": farmer.id,
                "net_status": NetStatus.retracted,
                "risk_level": RiskLevel.safe,
                "threshold_deploy": 35,
                "threshold_warning": 25,
                "threshold_critical": 45,
            },
            {
                "name": 'Green Horizon Plantation',
                "location": 'Anand, Gujarat',
                "latitude": 22.5645,
                "longitude": 72.9289,
                "area_acres": 72,
                "variety": 'Robusta',
                "owner_id": manager.id,
                "net_status": NetStatus.deployed,
                "risk_level": RiskLevel.high,
                "threshold_deploy": 30,
                "threshold_warning": 22,
                "threshold_critical": 40,
            },
            {
                "name": 'Nandini Banana Estate',
                "location": 'Thrissur, Kerala',
                "latitude": 10.5276,
                "longitude": 76.2144,
                "area_acres": 28,
                "variety": 'Nendran',
                "owner_id": farmer.id,
                "net_status": NetStatus.deploying,
                "risk_level": RiskLevel.moderate,
                "threshold_deploy": 32,
                "threshold_warning": 24,
                "threshold_critical": 42,
            },
            {
                "name": 'Sakshi Agro Farm',
                "location": 'Trichy, Tamil Nadu',
                "latitude": 10.7905,
                "longitude": 78.7047,
                "area_acres": 55,
                "variety": 'Red Banana',
                "owner_id": farmer.id,
                "net_status": NetStatus.deployed,
                "risk_level": RiskLevel.severe,
                "threshold_deploy": 28,
                "threshold_warning": 20,
                "threshold_critical": 38,
            },
        ]
        
        db_farms = []
        for fdata in farms_data:
            farm = Farm(**fdata)
            db.add(farm)
            db_farms.append(farm)
        db.commit()

        print("Seeding Sensors...")
        now = datetime.now(timezone.utc)
        
        sensors_data = [
            # Farm 1 (Safe)
            {"farm_id": db_farms[0].id, "wind_speed": 12.4, "wind_direction": "NNW", "wind_gust": 18.2, "temperature": 31.5, "humidity": 68, "rainfall": 0, "soil_moisture": 42, "battery_level": 94, "solar_output": 48.2, "pressure": 1013.2},
            # Farm 2 (High)
            {"farm_id": db_farms[1].id, "wind_speed": 38.7, "wind_direction": "WSW", "wind_gust": 52.1, "temperature": 28.3, "humidity": 82, "rainfall": 4.5, "soil_moisture": 71, "battery_level": 78, "solar_output": 22.1, "pressure": 1008.5},
            # Farm 3 (Moderate)
            {"farm_id": db_farms[2].id, "wind_speed": 26.1, "wind_direction": "SE", "wind_gust": 33.8, "temperature": 29.8, "humidity": 74, "rainfall": 1.2, "soil_moisture": 58, "battery_level": 88, "solar_output": 35.6, "pressure": 1010.8},
            # Farm 4 (Severe)
            {"farm_id": db_farms[3].id, "wind_speed": 54.3, "wind_direction": "NE", "wind_gust": 71.2, "temperature": 26.1, "humidity": 91, "rainfall": 12.8, "soil_moisture": 89, "battery_level": 62, "solar_output": 8.4, "pressure": 1002.1},
        ]
        
        for sdata in sensors_data:
            reading = SensorReading(**sdata, recorded_at=now)
            db.add(reading)
        db.commit()

        print("Seeding Events...")
        events_data = [
            {"farm_id": db_farms[1].id, "type": EventType.deployment, "severity": EventSeverity.warning, "message": "Windbreak nets auto-deployed — wind speed exceeded 35 km/h threshold"},
            {"farm_id": db_farms[3].id, "type": EventType.alert, "severity": EventSeverity.critical, "message": "SEVERE WIND ALERT — Wind gusts reaching 71 km/h. Immediate action required."},
        ]
        for idx, edata in enumerate(events_data):
            event = Event(**edata, created_at=now - timedelta(minutes=(idx+1)*15))
            db.add(event)
        db.commit()

        print("Database seeded successfully!")
        print(f"Test users: \n- {admin.email}\n- {manager.email}\n- {farmer.email}\nPassword for all: password123")

    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
