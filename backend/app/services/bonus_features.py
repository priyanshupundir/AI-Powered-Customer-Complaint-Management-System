"""
Bonus AI features for the Complaint Management System
- Complaint Completeness Checker
- CAPA (Corrective and Preventive Actions) Recommendations
- Root Cause Analysis Suggestions
- Duplicate Complaint Detection
"""

from typing import Dict, List, Optional
from app.graph.complaint_graph import ComplaintGraph
from app.models.complaint import Complaint
from sqlalchemy.orm import Session


class BonusFeaturesService:
    """
    Service for bonus AI features that enhance the complaint management system.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.complaint_graph = ComplaintGraph()
    
    async def check_complaint_completeness(self, complaint_data: Dict) -> Dict:
        """
        Check if a complaint has all required and recommended fields.
        Returns a completeness score and missing fields.
        """
        required_fields = [
            'product_name',
            'complaint_description'
        ]
        
        recommended_fields = [
            'product_strength',
            'batch_number',
            'manufacturing_date',
            'expiry_date',
            'affected_quantity',
            'customer_name',
            'customer_email',
            'reporter_name',
            'reporter_email'
        ]
        
        missing_required = []
        missing_recommended = []
        
        for field in required_fields:
            if not complaint_data.get(field):
                missing_required.append(field)
        
        for field in recommended_fields:
            if not complaint_data.get(field):
                missing_recommended.append(field)
        
        total_fields = len(required_fields) + len(recommended_fields)
        filled_fields = total_fields - len(missing_required) - len(missing_recommended)
        completeness_score = (filled_fields / total_fields) * 100 if total_fields > 0 else 0
        
        return {
            'completeness_score': round(completeness_score, 2),
            'is_complete': len(missing_required) == 0,
            'missing_required_fields': missing_required,
            'missing_recommended_fields': missing_recommended,
            'total_fields': total_fields,
            'filled_fields': filled_fields
        }
    
    async def generate_capa_recommendations(self, complaint_data: Dict, risk_assessment: Dict) -> Dict:
        """
        Generate CAPA (Corrective and Preventive Actions) recommendations
        based on complaint details and risk assessment.
        """
        prompt = f"""
        Based on the following complaint data and risk assessment, generate CAPA recommendations:
        
        Complaint Data:
        {complaint_data}
        
        Risk Assessment:
        {risk_assessment}
        
        Provide recommendations in the following JSON format:
        {{
            "corrective_actions": [
                {{
                    "action": "Specific corrective action",
                    "priority": "High/Medium/Low",
                    "timeline": "Specific timeline",
                    "responsible_party": "Who should handle this"
                }}
            ],
            "preventive_actions": [
                {{
                    "action": "Specific preventive action",
                    "priority": "High/Medium/Low",
                    "timeline": "Specific timeline",
                    "responsible_party": "Who should handle this"
                }}
            ],
            "root_cause_analysis": "Brief root cause analysis",
            "impact_assessment": "Overall impact assessment"
        }}
        
        Focus on pharmaceutical quality management best practices and regulatory requirements.
        """
        
        try:
            response = await self.complaint_graph.llm.ainvoke([
                {"role": "system", "content": "You are a pharmaceutical quality expert specializing in CAPA planning."},
                {"role": "user", "content": prompt}
            ])
            
            import json
            try:
                capa_data = json.loads(response.content)
                return capa_data
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                return {
                    "corrective_actions": [
                        {
                            "action": "Investigate the complaint thoroughly",
                            "priority": "High",
                            "timeline": "Within 7 days",
                            "responsible_party": "Quality Assurance"
                        }
                    ],
                    "preventive_actions": [
                        {
                            "action": "Review and update quality procedures",
                            "priority": "Medium",
                            "timeline": "Within 30 days",
                            "responsible_party": "Quality Management"
                        }
                    ],
                    "root_cause_analysis": "Root cause analysis pending investigation",
                    "impact_assessment": "Quality impact assessment pending"
                }
        except Exception as e:
            return {
                "error": str(e),
                "corrective_actions": [],
                "preventive_actions": [],
                "root_cause_analysis": "Unable to generate analysis",
                "impact_assessment": "Unable to assess impact"
            }
    
    async def suggest_root_causes(self, complaint_data: Dict) -> List[str]:
        """
        Suggest potential root causes based on complaint description and product details.
        """
        prompt = f"""
        Based on the following complaint, suggest potential root causes:
        
        Complaint Data:
        {complaint_data}
        
        Provide 3-5 potential root causes, ranked by likelihood.
        Focus on pharmaceutical manufacturing processes and quality control.
        Return as a JSON array of strings.
        """
        
        try:
            response = await self.complaint_graph.llm.ainvoke([
                {"role": "system", "content": "You are a pharmaceutical manufacturing expert specializing in root cause analysis."},
                {"role": "user", "content": prompt}
            ])
            
            import json
            try:
                root_causes = json.loads(response.content)
                return root_causes if isinstance(root_causes, list) else [response.content]
            except json.JSONDecodeError:
                return [response.content]
        except Exception as e:
            return ["Unable to generate root cause suggestions"]
    
    async def detect_duplicate_complaints(self, complaint_data: Dict) -> Dict:
        """
        Detect potential duplicate complaints in the database.
        """
        # Simple duplicate detection based on key fields
        duplicates = []
        
        query = self.db.query(Complaint)
        
        # Check for similar product names
        if complaint_data.get('product_name'):
            similar_products = query.filter(
                Complaint.product_name.ilike(f"%{complaint_data['product_name']}%")
            ).all()
            
            for complaint in similar_products:
                similarity_score = self._calculate_similarity(
                    complaint_data.get('complaint_description', ''),
                    complaint.complaint_description or ''
                )
                
                if similarity_score > 0.5:  # 50% similarity threshold
                    duplicates.append({
                        'complaint_id': complaint.id,
                        'product_name': complaint.product_name,
                        'batch_number': complaint.batch_number,
                        'similarity_score': round(similarity_score, 2),
                        'created_at': complaint.created_at.isoformat() if complaint.created_at else None
                    })
        
        return {
            'has_duplicates': len(duplicates) > 0,
            'duplicate_count': len(duplicates),
            'potential_duplicates': duplicates[:5]  # Return top 5 matches
        }
    
    async def generate_complaint_summary(self, complaint_data: Dict, risk_assessment: Dict) -> str:
        """
        Generate an executive summary of the complaint.
        """
        prompt = f"""
        Generate an executive summary of the following complaint:
        
        Complaint Data:
        {complaint_data}
        
        Risk Assessment:
        {risk_assessment}
        
        The summary should be concise (2-3 sentences) and suitable for management review.
        Include the key issue, severity, and recommended actions.
        """
        
        try:
            response = await self.complaint_graph.llm.ainvoke([
                {"role": "system", "content": "You are a pharmaceutical quality manager writing executive summaries."},
                {"role": "user", "content": prompt}
            ])
            
            return response.content
        except Exception as e:
            return f"Unable to generate summary: {str(e)}"
    
    def _calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate similarity between two text strings using simple word overlap.
        """
        if not text1 or not text2:
            return 0.0
        
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        return len(intersection) / len(union) if union else 0.0