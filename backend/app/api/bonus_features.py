from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.complaint import ComplaintResponse, RiskAssessmentResponse
from app.services.bonus_features import BonusFeaturesService
from typing import Dict
from pydantic import BaseModel

router = APIRouter()


class CompletenessCheckRequest(BaseModel):
    complaint_data: Dict


class CAPARequest(BaseModel):
    complaint_data: Dict
    risk_assessment: Dict


class RootCauseRequest(BaseModel):
    complaint_data: Dict


class DuplicateCheckRequest(BaseModel):
    complaint_data: Dict


class SummaryRequest(BaseModel):
    complaint_data: Dict
    risk_assessment: Dict


@router.post("/completeness")
async def check_completeness(
    request: CompletenessCheckRequest,
    db: Session = Depends(get_db)
):
    """
    Check if a complaint has all required and recommended fields.
    Returns completeness score and missing fields.
    """
    try:
        service = BonusFeaturesService(db)
        result = await service.check_complaint_completeness(request.complaint_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/capa")
async def generate_capa(
    request: CAPARequest,
    db: Session = Depends(get_db)
):
    """
    Generate CAPA (Corrective and Preventive Actions) recommendations
    based on complaint details and risk assessment.
    """
    try:
        service = BonusFeaturesService(db)
        result = await service.generate_capa_recommendations(
            request.complaint_data,
            request.risk_assessment
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/root-causes")
async def suggest_root_causes(
    request: RootCauseRequest,
    db: Session = Depends(get_db)
):
    """
    Suggest potential root causes based on complaint description and product details.
    """
    try:
        service = BonusFeaturesService(db)
        result = await service.suggest_root_causes(request.complaint_data)
        return {"root_causes": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/duplicates")
async def detect_duplicates(
    request: DuplicateCheckRequest,
    db: Session = Depends(get_db)
):
    """
    Detect potential duplicate complaints in the database.
    """
    try:
        service = BonusFeaturesService(db)
        result = await service.detect_duplicate_complaints(request.complaint_data)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summary")
async def generate_summary(
    request: SummaryRequest,
    db: Session = Depends(get_db)
):
    """
    Generate an executive summary of the complaint.
    """
    try:
        service = BonusFeaturesService(db)
        result = await service.generate_complaint_summary(
            request.complaint_data,
            request.risk_assessment
        )
        return {"summary": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))