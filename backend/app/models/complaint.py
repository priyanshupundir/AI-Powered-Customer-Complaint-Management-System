from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), nullable=False)
    product_strength = Column(String(100), nullable=True)
    batch_number = Column(String(100), nullable=True)
    manufacturing_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    affected_quantity = Column(String(100), nullable=True)
    complaint_description = Column(Text, nullable=True)
    customer_name = Column(String(255), nullable=True)
    customer_email = Column(String(255), nullable=True)
    reporter_name = Column(String(255), nullable=True)
    reporter_email = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    risk_assessment = relationship("RiskAssessment", back_populates="complaint", uselist=False)
    chat_history = relationship("ChatHistory", back_populates="complaint")
    documents = relationship("Document", back_populates="complaint")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False)
    severity = Column(String(50), nullable=True)  # Critical, Major, Minor
    risk_level = Column(String(50), nullable=True)
    recommended_actions = Column(JSON, nullable=True)
    regulatory_impact = Column(Text, nullable=True)
    quality_impact = Column(Text, nullable=True)
    timeline_recommendation = Column(String(255), nullable=True)
    ai_reasoning = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    complaint = relationship("Complaint", back_populates="risk_assessment")


class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=True)
    user_message = Column(Text, nullable=True)
    ai_response = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    complaint = relationship("Complaint", back_populates="chat_history")


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id", ondelete="CASCADE"), nullable=True)
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(500), nullable=True)
    file_type = Column(String(50), nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    complaint = relationship("Complaint", back_populates="documents")