"""Script to generate realistic historical data for show."""

import sys
import os
import random
from datetime import datetime, timezone, timedelta

# Add the parent directory to the path so we can import the app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base, SessionLocal
from app.models.farm import Farm
from app.models.event import Event, EventType, EventSeverity
from app.models.damage_report import DamageReport, ReportStatus

def generate_fake_data():
    db = SessionLocal()
    try:
        farms = db.query(Farm).all()
        if not farms:
            print("No farms found. Run seed.py first.")
            return

        now = datetime.now(timezone.utc)

        # Generate 50 fake events
        print("Generating 50 historical events...")
        event_messages = [
            (EventType.deployment, EventSeverity.warning, "Windbreak nets auto-deployed — wind speed exceeded threshold"),
            (EventType.deployment, EventSeverity.info, "Windbreak nets retracted manually by manager"),
            (EventType.alert, EventSeverity.critical, "SEVERE WIND ALERT — Wind gusts reaching cyclonic levels."),
            (EventType.alert, EventSeverity.warning, "High wind warning — Monitoring eastern sector closely."),
            (EventType.sensor, EventSeverity.warning, "Battery level below 20% — solar output reduced due to cloud cover"),
            (EventType.sensor, EventSeverity.info, "Sensor calibration complete"),
            (EventType.system, EventSeverity.success, "All systems nominal. Network connection restored."),
            (EventType.system, EventSeverity.info, "Routine system backup completed successfully."),
        ]

        for i in range(50):
            farm = random.choice(farms)
            etype, severity, msg = random.choice(event_messages)
            # Random time in the past 14 days
            past_time = now - timedelta(hours=random.randint(1, 14*24), minutes=random.randint(0, 59))
            
            event = Event(
                farm_id=farm.id,
                type=etype,
                severity=severity,
                message=msg,
                created_at=past_time
            )
            db.add(event)

        # Generate 15 damage reports
        print("Generating 15 damage reports...")
        damage_types = [
            "Leaf Tearing", "Stem Snap", "Uprooting", "Net Damage", "Waterlogging"
        ]
        
        for i in range(15):
            farm = random.choice(farms)
            past_time = now - timedelta(days=random.randint(1, 30))
            
            report = DamageReport(
                farm_id=farm.id,
                reported_by=farm.owner_id,
                damage_type=random.choice(damage_types),
                severity=random.choice(["minor", "moderate", "severe", "total_loss"]),
                estimated_loss=random.randint(5000, 150000),
                description="Wind storm caused significant damage to the northern perimeter of the plantation. Immediate assessment requested.",
                status=random.choice(list(ReportStatus)),
                photo_count=random.randint(1, 5),
                created_at=past_time
            )
            db.add(report)

        db.commit()
        print("Fake data generation complete!")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    generate_fake_data()
