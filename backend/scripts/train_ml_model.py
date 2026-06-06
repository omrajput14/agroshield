"""Machine Learning model training pipeline for AgroShield AI."""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

def synthesize_data(num_samples=5000):
    """Generates synthetic historical storm and farm data."""
    np.random.seed(42)
    
    # Random realistic data ranges
    wind_speed = np.random.uniform(5.0, 110.0, num_samples)
    wind_gust = wind_speed * np.random.uniform(1.1, 1.5, num_samples)
    temperature = np.random.uniform(20.0, 45.0, num_samples)
    humidity = np.random.uniform(40.0, 95.0, num_samples)
    farm_area = np.random.uniform(10.0, 100.0, num_samples)
    
    # 0 = retracted, 1 = deployed
    nets_deployed = np.random.choice([0, 1], num_samples, p=[0.6, 0.4])
    
    # Calculate synthetic "true" damage probability using a non-linear formula
    # High wind + gusts strongly increase damage.
    # Deploying nets strongly reduces damage.
    
    base_risk = (wind_speed / 100.0) ** 2 + (wind_gust / 150.0) ** 1.5
    
    # Temperature and humidity add minor stress factors
    stress_factor = ((temperature - 30) / 50.0) + (humidity / 200.0)
    
    # Nets reduce damage significantly
    net_protection = nets_deployed * 0.4
    
    # Area slightly increases probability of SOME damage occurring somewhere
    area_factor = farm_area / 500.0
    
    damage_prob = base_risk + stress_factor + area_factor - net_protection
    
    # Add random noise
    damage_prob += np.random.normal(0, 0.05, num_samples)
    
    # Clip between 0 and 1
    damage_prob = np.clip(damage_prob, 0.01, 0.99)
    
    df = pd.DataFrame({
        'wind_speed': wind_speed,
        'wind_gust': wind_gust,
        'temperature': temperature,
        'humidity': humidity,
        'farm_area_acres': farm_area,
        'nets_deployed': nets_deployed,
        'damage_probability': damage_prob
    })
    
    return df

def train_model():
    print("Generating synthetic dataset...")
    df = synthesize_data(5000)
    
    features = ['wind_speed', 'wind_gust', 'temperature', 'humidity', 'farm_area_acres', 'nets_deployed']
    target = 'damage_probability'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    print("Evaluating model...")
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    rmse = np.sqrt(mean_squared_error(y_test, predictions))
    
    print(f"Mean Absolute Error: {mae:.4f}")
    print(f"Root Mean Squared Error: {rmse:.4f}")
    
    # Save model
    model_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'app', 'ml_models')
    os.makedirs(model_dir, exist_ok=True)
    
    model_path = os.path.join(model_dir, 'damage_model.joblib')
    joblib.dump(model, model_path)
    print(f"Model saved successfully to {model_path}!")

if __name__ == "__main__":
    train_model()
