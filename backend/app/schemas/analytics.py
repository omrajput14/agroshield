"""Analytics schemas for the dashboard and charts."""

from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_deployments: int
    deployments_this_month: int
    avg_response_time: float
    losses_prevented_estimate: float
    uptime: float
    active_farms: int
    total_sensors: int
    alerts_sent: int


class MonthlyDeploymentStats(BaseModel):
    month: str
    deployments: int
    losses: float
    prevented: float


class RiskDistributionStats(BaseModel):
    name: str
    value: int
    color: str


class AnalyticsResponse(BaseModel):
    stats: DashboardStats
    monthly_deployments: list[MonthlyDeploymentStats]
    risk_distribution: list[RiskDistributionStats]
