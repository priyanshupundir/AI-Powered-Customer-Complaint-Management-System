from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date


class ComplaintBase(BaseModel):
    product_name: str = Field(..., description="Name of the pharmaceutical product")
    product_strength: Optional[str] = Field(None, description="Product strength or grade")
    batch_number: Optional[str] = Field(None, description="Batch or lot number")
    manufacturing_date: Optional[date] = Field(None, description="Manufacturing date")
    expiry_date: Optional[date] = Field(None, description="Expiry date")
    affected_quantity: Optional[str] = Field(None, description="Quantity affected")
    complaint_description: Optional[str] = Field(None, description="Description of the complaint")
    customer_name: Optional[str] = Field(None, description="Customer name")
    customer_email: Optional[str] = Field(None, description="Customer email")
    reporter_name: Optional[str] = Field(None, description="Reporter name")
    reporter_email: Optional[str] = Field(None, description="Reporter email")


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintUpdate(ComplaintBase):
    pass


class ComplaintResponse(ComplaintBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class RiskAssessmentBase(BaseModel):
    severity: Optional[str] = Field(None, description="Severity level: Critical, Major, Minor")
    risk_level: Optional[str] = Field(None, description="Risk level assessment")
    recommended_actions: Optional[List[str]] = Field(None, description="List of recommended actions")
    regulatory_impact: Optional[str] = Field(None, description="Regulatory impact assessment")
    quality_impact: Optional[str] = Field(None, description="Quality impact assessment")
    timeline_recommendation: Optional[str] = Field(None, description="Timeline for resolution")
    ai_reasoning: Optional[str] = Field(None, description="AI's reasoning for the assessment")


class RiskAssessmentCreate(RiskAssessmentBase):
    complaint_id: int


class RiskAssessmentResponse(RiskAssessmentBase):
    id: int
    complaint_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class ChatMessageBase(BaseModel):
    user_message: Optional[str] = None
    ai_response: Optional[str] = None


class ChatMessageCreate(ChatMessageBase):
    complaint_id: Optional[int] = None


class ChatMessageResponse(ChatMessageBase):
    id: int
    complaint_id: Optional[int] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True


class LogComplaintRequest(BaseModel):
    prompt: str = Field(..., description="Natural language prompt describing the complaint")


class EditComplaintRequest(BaseModel):
    complaint_id: int = Field(..., description="ID of the complaint to edit")
    prompt: str = Field(..., description="Natural language prompt describing the changes")


class ExtractDocumentRequest(BaseModel):
    file_content: str = Field(..., description="Content of the uploaded document")
    file_type: str = Field(..., description="Type of file (pdf, email, etc.)")


class ComplaintWithRiskResponse(BaseModel):
    complaint: ComplaintResponse
    risk_assessment: Optional[RiskAssessmentResponse] = None


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message to the AI")
    complaint_id: Optional[int] = Field(None, description="Associated complaint ID if any")


class ChatResponse(BaseModel):
    response: str
    complaint_updates: Optional[ComplaintResponse] = None
    risk_updates: Optional[RiskAssessmentResponse] = None