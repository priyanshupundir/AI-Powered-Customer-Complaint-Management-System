from sqlalchemy.orm import Session
from app.models.complaint import Complaint, RiskAssessment, Document
from app.schemas.complaint import ComplaintWithRiskResponse, ComplaintResponse, RiskAssessmentResponse
from app.graph.complaint_graph import ComplaintGraph
from typing import Optional
import datetime


class ComplaintService:
    def __init__(self, db: Session):
        self.db = db
        self.complaint_graph = ComplaintGraph()
    
    async def log_complaint_from_prompt(self, prompt: str) -> ComplaintWithRiskResponse:
        """
        Process a natural language prompt to log a new complaint.
        """
        # Use LangGraph to extract complaint data and perform risk assessment
        extracted_data = await self.complaint_graph.process_log_complaint(prompt)
        
        # Create complaint record
        complaint = Complaint(
            product_name=extracted_data.get("product_name", ""),
            product_strength=extracted_data.get("product_strength"),
            batch_number=extracted_data.get("batch_number"),
            manufacturing_date=self._parse_date(extracted_data.get("manufacturing_date")),
            expiry_date=self._parse_date(extracted_data.get("expiry_date")),
            affected_quantity=extracted_data.get("affected_quantity"),
            complaint_description=extracted_data.get("complaint_description"),
            customer_name=extracted_data.get("customer_name"),
            customer_email=extracted_data.get("customer_email"),
            reporter_name=extracted_data.get("reporter_name"),
            reporter_email=extracted_data.get("reporter_email")
        )
        
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        
        # Create risk assessment
        risk_data = extracted_data.get("risk_assessment", {})
        risk_assessment = RiskAssessment(
            complaint_id=complaint.id,
            severity=risk_data.get("severity"),
            risk_level=risk_data.get("risk_level"),
            recommended_actions=risk_data.get("recommended_actions", []),
            regulatory_impact=risk_data.get("regulatory_impact"),
            quality_impact=risk_data.get("quality_impact"),
            timeline_recommendation=risk_data.get("timeline_recommendation"),
            ai_reasoning=risk_data.get("ai_reasoning")
        )
        
        self.db.add(risk_assessment)
        self.db.commit()
        self.db.refresh(risk_assessment)
        
        return ComplaintWithRiskResponse(
            complaint=ComplaintResponse.from_orm(complaint),
            risk_assessment=RiskAssessmentResponse.from_orm(risk_assessment)
        )
    
    async def edit_complaint_from_prompt(self, complaint_id: int, prompt: str) -> ComplaintWithRiskResponse:
        """
        Edit an existing complaint using natural language.
        """
        # Get existing complaint
        complaint = self.db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if not complaint:
            raise ValueError("Complaint not found")
        
        current_data = {
            "product_name": complaint.product_name,
            "product_strength": complaint.product_strength,
            "batch_number": complaint.batch_number,
            "manufacturing_date": str(complaint.manufacturing_date) if complaint.manufacturing_date else None,
            "expiry_date": str(complaint.expiry_date) if complaint.expiry_date else None,
            "affected_quantity": complaint.affected_quantity,
            "complaint_description": complaint.complaint_description,
            "customer_name": complaint.customer_name,
            "customer_email": complaint.customer_email,
            "reporter_name": complaint.reporter_name,
            "reporter_email": complaint.reporter_email,
        }
        
        # Use LangGraph to parse edit instructions
        edit_data = await self.complaint_graph.process_edit_complaint(prompt, current_data)
        
        # Update complaint fields
        for field, value in edit_data.get("complaint_updates", {}).items():
            if hasattr(complaint, field):
                if field in ["manufacturing_date", "expiry_date"]:
                    setattr(complaint, field, self._parse_date(value))
                else:
                    setattr(complaint, field, value)
        
        self.db.commit()
        self.db.refresh(complaint)
        
        # Update or create risk assessment
        risk_data = edit_data.get("risk_assessment", {})
        existing_risk = self.db.query(RiskAssessment).filter(
            RiskAssessment.complaint_id == complaint_id
        ).first()
        
        if existing_risk:
            for field, value in risk_data.items():
                if hasattr(existing_risk, field):
                    setattr(existing_risk, field, value)
            self.db.commit()
            self.db.refresh(existing_risk)
            risk_assessment = existing_risk
        else:
            risk_assessment = RiskAssessment(
                complaint_id=complaint.id,
                severity=risk_data.get("severity"),
                risk_level=risk_data.get("risk_level"),
                recommended_actions=risk_data.get("recommended_actions", []),
                regulatory_impact=risk_data.get("regulatory_impact"),
                quality_impact=risk_data.get("quality_impact"),
                timeline_recommendation=risk_data.get("timeline_recommendation"),
                ai_reasoning=risk_data.get("ai_reasoning")
            )
            self.db.add(risk_assessment)
            self.db.commit()
            self.db.refresh(risk_assessment)
        
        return ComplaintWithRiskResponse(
            complaint=ComplaintResponse.from_orm(complaint),
            risk_assessment=RiskAssessmentResponse.from_orm(risk_assessment)
        )
    
    async def extract_complaint_from_document(
        self, 
        file_content: bytes, 
        file_type: str,
        filename: str
    ) -> ComplaintWithRiskResponse:
        """
        Extract complaint information from a document.
        """
        # Use LangGraph to process document
        extracted_data = await self.complaint_graph.process_document_extraction(
            file_content, 
            file_type
        )
        
        # Create complaint record
        complaint = Complaint(
            product_name=extracted_data.get("product_name", ""),
            product_strength=extracted_data.get("product_strength"),
            batch_number=extracted_data.get("batch_number"),
            manufacturing_date=self._parse_date(extracted_data.get("manufacturing_date")),
            expiry_date=self._parse_date(extracted_data.get("expiry_date")),
            affected_quantity=extracted_data.get("affected_quantity"),
            complaint_description=extracted_data.get("complaint_description"),
            customer_name=extracted_data.get("customer_name"),
            customer_email=extracted_data.get("customer_email"),
            reporter_name=extracted_data.get("reporter_name"),
            reporter_email=extracted_data.get("reporter_email")
        )
        
        self.db.add(complaint)
        self.db.commit()
        self.db.refresh(complaint)
        
        # Create document record
        document = Document(
            complaint_id=complaint.id,
            file_name=filename,
            file_path=f"uploads/{filename}",  # In production, save to actual storage
            file_type=file_type
        )
        self.db.add(document)
        self.db.commit()
        
        # Create risk assessment
        risk_data = extracted_data.get("risk_assessment", {})
        risk_assessment = RiskAssessment(
            complaint_id=complaint.id,
            severity=risk_data.get("severity"),
            risk_level=risk_data.get("risk_level"),
            recommended_actions=risk_data.get("recommended_actions", []),
            regulatory_impact=risk_data.get("regulatory_impact"),
            quality_impact=risk_data.get("quality_impact"),
            timeline_recommendation=risk_data.get("timeline_recommendation"),
            ai_reasoning=risk_data.get("ai_reasoning")
        )
        
        self.db.add(risk_assessment)
        self.db.commit()
        self.db.refresh(risk_assessment)
        
        return ComplaintWithRiskResponse(
            complaint=ComplaintResponse.from_orm(complaint),
            risk_assessment=RiskAssessmentResponse.from_orm(risk_assessment)
        )
    
    def get_complaint_by_id(self, complaint_id: int) -> Optional[ComplaintWithRiskResponse]:
        """
        Get a complaint by ID with its risk assessment.
        """
        complaint = self.db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if not complaint:
            return None
        
        risk_assessment = self.db.query(RiskAssessment).filter(
            RiskAssessment.complaint_id == complaint_id
        ).first()
        
        return ComplaintWithRiskResponse(
            complaint=ComplaintResponse.from_orm(complaint),
            risk_assessment=RiskAssessmentResponse.from_orm(risk_assessment) if risk_assessment else None
        )
    
    def list_complaints(self, skip: int = 0, limit: int = 100) -> list[ComplaintResponse]:
        """
        List all complaints with pagination.
        """
        complaints = self.db.query(Complaint).offset(skip).limit(limit).all()
        return [ComplaintResponse.from_orm(complaint) for complaint in complaints]
    
    def _parse_date(self, date_str: Optional[str]) -> Optional[datetime.date]:
        """
        Parse date string to datetime.date object.
        """
        if not date_str:
            return None
        
        try:
            # Try common date formats
            for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y%m%d"]:
                try:
                    return datetime.datetime.strptime(str(date_str).strip(), fmt).date()
                except ValueError:
                    continue
            return None
        except Exception:
            return None