"""AI Prediction service stub for damage probability calculation."""

from sqlalchemy.orm import Session
from app.models.farm import Farm

def get_ai_predictions(db: Session):
    """Returns mock AI predictions ready to be replaced with real Scikit-Learn logic."""
    return [
        {
            "farm_id": 2,
            "farm_name": "Green Horizon Plantation",
            "damage_probability": 0.72,
            "predicted_peak_wind": 58.0,
            "peak_time": "16:30",
            "recommendation": "Keep nets deployed. Expected wind intensification in next 2 hours. Consider manual reinforcement of eastern perimeter.",
            "confidence": 0.85,
        },
        {
            "farm_id": 4,
            "farm_name": "Sakshi Agro Farm",
            "damage_probability": 0.91,
            "predicted_peak_wind": 78.0,
            "peak_time": "15:45",
            "recommendation": "CRITICAL: Cyclonic pattern detected. Activate emergency protocol. All nets deployed. Notify field workers immediately.",
            "confidence": 0.92,
        },
        {
            "farm_id": 3,
            "farm_name": "Nandini Banana Estate",
            "damage_probability": 0.34,
            "predicted_peak_wind": 36.0,
            "peak_time": "17:00",
            "recommendation": "Moderate risk window approaching. Net deployment in progress. Monitor eastern and southern sectors.",
            "confidence": 0.78,
        },
    ]
