"""A test script to trigger the Risk Engine and dispatch a mock SMS."""

import sys
import os
from datetime import datetime, timezone

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.farm import Farm, NetStatus
from app.models.sensor_reading import SensorReading
from app.services.risk_engine import process_sensor_reading
from app.models.user import User

def trigger_alert():
    db = SessionLocal()
    try:
        # Find Sakshi Agro Farm (ID 4)
        farm = db.query(Farm).filter(Farm.name == "Sakshi Agro Farm").first()
        if not farm:
            print("Farm not found.")
            return
            
        # Ensure nets are retracted so it triggers the auto-deploy logic
        farm.net_status = NetStatus.retracted
        db.commit()

        print(f"Triggering hurricane force winds for {farm.name}...")
        
        # Create a severe sensor reading
        reading = SensorReading(
            farm_id=farm.id,
            wind_speed=85.5, # Severe wind!
            wind_gust=102.1,
            wind_direction="NW",
            temperature=24.5,
            humidity=95,
            rainfall=22.0,
            soil_moisture=98,
            battery_level=100,
            solar_output=0.0,
            pressure=995.2,
            recorded_at=datetime.now(timezone.utc)
        )
        db.add(reading)
        db.commit()

        # Pass it to the Risk Engine
        process_sensor_reading(db, farm, reading)
        print("Success! Check the logs above for the Mock SMS payload.")

    finally:
        db.close()

if __name__ == "__main__":
    trigger_alert()
