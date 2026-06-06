from __future__ import annotations
"""Damage reports router."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.damage_report import DamageReport
from app.schemas.damage_report import DamageReportResponse, DamageReportCreate, DamageReportUpdate
from app.services.auth_service import get_current_active_user, require_manager

router = APIRouter(prefix="/api/damage-reports", tags=["damage-reports"])


@router.get("", response_model=list[DamageReportResponse])
def get_damage_reports(
    skip: int = 0,
    limit: int = 50,
    farm_id: int | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    query = db.query(DamageReport)
    
    if farm_id:
        query = query.filter(DamageReport.farm_id == farm_id)
        
    reports = query.order_by(DamageReport.created_at.desc()).offset(skip).limit(limit).all()
    
    for report in reports:
        if report.farm:
            report.farm_name = report.farm.name
            
    return reports


@router.post("", response_model=DamageReportResponse)
def create_damage_report(
    report_in: DamageReportCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    report = DamageReport(
        **report_in.model_dump(),
        reported_by=current_user.id
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    
    if report.farm:
        report.farm_name = report.farm.name
        
    return report


@router.put("/{report_id}", response_model=DamageReportResponse)
def update_damage_report(
    report_id: int,
    report_in: DamageReportUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_manager),
):
    report = db.query(DamageReport).filter(DamageReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Damage report not found")
        
    update_data = report_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(report, field, value)
        
    db.commit()
    db.refresh(report)
    
    if report.farm:
        report.farm_name = report.farm.name
        
    return report
