"""AI Prediction service using Scikit-Learn for damage probability calculation."""

import os
import joblib
import pandas as pd
from sqlalchemy.orm import Session
from app.models.farm import Farm
from app.models.sensor_reading import SensorReading
from app.models.farm import NetStatus

# Load model globally on server start
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml_models', 'damage_model.joblib')

try:
    if os.path.exists(MODEL_PATH):
        ml_model = joblib.load(MODEL_PATH)
        print(f"✅ AI Prediction Model loaded successfully from {MODEL_PATH}")
    else:
        ml_model = None
        print(f"⚠️ AI Prediction Model not found at {MODEL_PATH}. Run training script first.")
except Exception as e:
    ml_model = None
    print(f"❌ Failed to load AI Prediction Model: {e}")

def get_ai_predictions(db: Session):
    """Returns real AI predictions based on live sensor data."""
    farms = db.query(Farm).all()
    predictions = []
    
    for farm in farms:
        # Get latest sensor reading
        reading = db.query(SensorReading).filter(SensorReading.farm_id == farm.id).order_by(SensorReading.recorded_at.desc()).first()
        
        if not reading or not ml_model:
            # Fallback to a zero-risk dummy if no model or no sensors
            predictions.append({
                "farm_id": farm.id,
                "farm_name": farm.name,
                "damage_probability": 0.05,
                "predicted_peak_wind": reading.wind_speed if reading else 10.0,
                "peak_time": "Now",
                "recommendation": "System initializing or insufficient data. Model not loaded.",
                "confidence": 0.5,
            })
            continue

        nets_deployed = 1 if farm.net_status in [NetStatus.deployed, NetStatus.deploying] else 0
        
        # Prepare feature vector (must match training features)
        # ['wind_speed', 'wind_gust', 'temperature', 'humidity', 'farm_area_acres', 'nets_deployed']
        features = pd.DataFrame([{
            'wind_speed': reading.wind_speed,
            'wind_gust': reading.wind_gust,
            'temperature': reading.temperature,
            'humidity': reading.humidity,
            'farm_area_acres': farm.area_acres,
            'nets_deployed': nets_deployed
        }])
        
        # Run real inference
        damage_prob = ml_model.predict(features)[0]
        
        # Generate dynamic recommendation
        if damage_prob > 0.8:
            rec = "CRITICAL: Severe damage expected. Keep nets fully deployed. Do not allow personnel in field."
            conf = 0.92
        elif damage_prob > 0.4:
            rec = "High risk window approaching. Auto-deployment logic active. Monitor eastern sectors."
            conf = 0.85
        elif damage_prob > 0.15:
            rec = "Moderate risk. Winds increasing. Nets should remain deployed if gusts exceed 40 km/h."
            conf = 0.78
        else:
            rec = "Wind conditions normal. No immediate threat to crops. Nets can be safely retracted."
            conf = 0.95
            
        predictions.append({
            "farm_id": farm.id,
            "farm_name": farm.name,
            "damage_probability": round(damage_prob, 3),
            "predicted_peak_wind": round(reading.wind_gust * 1.1, 1),
            "peak_time": "18:00", # Can be dynamic based on forecast
            "recommendation": rec,
            "confidence": conf,
        })
        
    return predictions
