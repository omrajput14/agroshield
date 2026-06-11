"""AgroShield AI — FastAPI Entry Point."""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

# Import routers
from app.routers import (
    auth,
    farms,
    sensors,
    events,
    damage_reports,
    analytics,
    predictions,
    forecasts,
    nets,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Run startup tasks: seed the DB if empty."""
    try:
        from app.seed import seed_db
        seed_db()
    except Exception as e:
        print(f"[Seed] Warning: {e}")
    yield


app = FastAPI(
    title="AgroShield AI Backend",
    description="Intelligent wind-protection system for banana farms",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://agroshield10.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(farms.router)
app.include_router(sensors.router)
app.include_router(events.router)
app.include_router(damage_reports.router)
app.include_router(analytics.router)
app.include_router(predictions.router)
app.include_router(forecasts.router)
app.include_router(nets.router)

@app.get("/")
def root():
    return {"message": "Welcome to AgroShield AI API. Visit /docs for Swagger UI."}
