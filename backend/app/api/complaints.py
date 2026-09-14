from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional
import traceback
from app.core.database import get_db
from app.schemas.complaint import (
    LogComplaintRequest, 
    EditComplaintRequest, 
    ComplaintWithRiskResponse,
    ComplaintResponse
)
from app.services.complaint_service import ComplaintService

router = APIRouter()


@router.post("/log", response_model=ComplaintWithRiskResponse)
async def log_complaint(
    request: LogComplaintRequest,
    db: Session = Depends(get_db)
):
    """
    Log a new complaint using natural language.
    The AI will extract complaint details and perform risk assessment.
    """
    try:
        complaint_service = ComplaintService(db)
        result = await complaint_service.log_complaint_from_prompt(request.prompt)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/edit", response_model=ComplaintWithRiskResponse)
async def edit_complaint(
    request: EditComplaintRequest,
    db: Session = Depends(get_db)
):
    """
    Edit an existing complaint using natural language.
    The AI will understand the changes and update the complaint accordingly.
    """
    try:
        complaint_service = ComplaintService(db)
        result = await complaint_service.edit_complaint_from_prompt(
            request.complaint_id, 
            request.prompt
        )
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/extract", response_model=ComplaintWithRiskResponse)
async def extract_from_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Extract complaint information from an uploaded document (PDF, email, etc.).
    The AI will parse the document and extract relevant complaint details.
    """
    try:
        complaint_service = ComplaintService(db)
        
        # Read file content
        file_content = await file.read()
        file_type = file.content_type
        
        result = await complaint_service.extract_complaint_from_document(
            file_content, 
            file_type,
            file.filename
        )
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{complaint_id}", response_model=ComplaintWithRiskResponse)
async def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific complaint by ID along with its risk assessment.
    """
    try:
        complaint_service = ComplaintService(db)
        result = complaint_service.get_complaint_by_id(complaint_id)
        if not result:
            raise HTTPException(status_code=404, detail="Complaint not found")
        return result
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=list[ComplaintResponse])
async def list_complaints(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    List all complaints with pagination.
    """
    try:
        complaint_service = ComplaintService(db)
        complaints = complaint_service.list_complaints(skip=skip, limit=limit)
        return complaints
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))