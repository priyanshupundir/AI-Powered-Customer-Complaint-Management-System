from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
from typing import TypedDict, Annotated, Optional
import operator
import json


class ComplaintState(TypedDict):
    prompt: str
    extracted_data: dict
    risk_assessment: dict
    response: str
    current_complaint: Optional[dict]


class ComplaintGraph:
    def __init__(self):
        # Initialize Groq LLM
        self.llm = ChatGroq(
            model="gemma2-9b-it",
            api_key=settings.GROQ_API_KEY,
            temperature=0.1
        )
        
        # Build the graph
        self.graph = self._build_graph()
    
    def _build_graph(self) -> StateGraph:
        """
        Build the LangGraph workflow for complaint processing.
        """
        workflow = StateGraph(ComplaintState)
        
        # Add nodes
        workflow.add_node("parse_intent", self._parse_intent)
        workflow.add_node("extract_complaint_data", self._extract_complaint_data)
        workflow.add_node("assess_risk", self._assess_risk)
        workflow.add_node("format_response", self._format_response)
        
        # Set entry point
        workflow.set_entry_point("parse_intent")
        
        # Add edges
        workflow.add_edge("parse_intent", "extract_complaint_data")
        workflow.add_edge("extract_complaint_data", "assess_risk")
        workflow.add_edge("assess_risk", "format_response")
        workflow.add_edge("format_response", END)
        
        return workflow.compile()
    
    async def process_log_complaint(self, prompt: str) -> dict:
        """
        Process a log complaint request.
        """
        initial_state = {
            "prompt": prompt,
            "extracted_data": {},
            "risk_assessment": {},
            "response": "",
            "current_complaint": None
        }
        
        # Run the graph
        final_state = await self.graph.ainvoke(initial_state)
        
        return {
            "product_name": final_state["extracted_data"].get("product_name", ""),
            "product_strength": final_state["extracted_data"].get("product_strength"),
            "batch_number": final_state["extracted_data"].get("batch_number"),
            "manufacturing_date": final_state["extracted_data"].get("manufacturing_date"),
            "expiry_date": final_state["extracted_data"].get("expiry_date"),
            "affected_quantity": final_state["extracted_data"].get("affected_quantity"),
            "complaint_description": final_state["extracted_data"].get("complaint_description"),
            "customer_name": final_state["extracted_data"].get("customer_name"),
            "customer_email": final_state["extracted_data"].get("customer_email"),
            "reporter_name": final_state["extracted_data"].get("reporter_name"),
            "reporter_email": final_state["extracted_data"].get("reporter_email"),
            "risk_assessment": final_state["risk_assessment"]
        }
    
    async def process_edit_complaint(self, prompt: str, current_complaint) -> dict:
        """
        Process an edit complaint request.
        """
        # For editing, we need to understand what's changing
        edit_prompt = f"""
        Current complaint data:
        {json.dumps(current_complaint.__dict__, default=str, indent=2)}
        
        Edit request: {prompt}
        
        Identify which fields need to be updated and their new values.
        """
        
        initial_state = {
            "prompt": edit_prompt,
            "extracted_data": {},
            "risk_assessment": {},
            "response": "",
            "current_complaint": current_complaint.__dict__
        }
        
        final_state = await self.graph.ainvoke(initial_state)
        
        return {
            "complaint_updates": final_state["extracted_data"],
            "risk_assessment": final_state["risk_assessment"]
        }
    
    async def process_document_extraction(self, file_content: bytes, file_type: str) -> dict:
        """
        Process document extraction.
        """
        # This is a simplified version - in production, you'd use proper OCR/PDF parsing
        # For now, we'll use the LLM to process the text content
        
        # Convert bytes to string (simplified - in production use proper PDF parsing)
        try:
            text_content = file_content.decode('utf-8', errors='ignore')
        except:
            text_content = str(file_content)
        
        extraction_prompt = f"""
        Extract complaint information from the following document content:
        
        File type: {file_type}
        Content: {text_content[:10000]}  # Limit content to avoid token limits
        
        Extract all relevant complaint details including product information, 
        batch numbers, dates, quantities, and any other relevant information.
        """
        
        initial_state = {
            "prompt": extraction_prompt,
            "extracted_data": {},
            "risk_assessment": {},
            "response": "",
            "current_complaint": None
        }
        
        final_state = await self.graph.ainvoke(initial_state)
        
        return {
            "product_name": final_state["extracted_data"].get("product_name", ""),
            "product_strength": final_state["extracted_data"].get("product_strength"),
            "batch_number": final_state["extracted_data"].get("batch_number"),
            "manufacturing_date": final_state["extracted_data"].get("manufacturing_date"),
            "expiry_date": final_state["extracted_data"].get("expiry_date"),
            "affected_quantity": final_state["extracted_data"].get("affected_quantity"),
            "complaint_description": final_state["extracted_data"].get("complaint_description"),
            "customer_name": final_state["extracted_data"].get("customer_name"),
            "customer_email": final_state["extracted_data"].get("customer_email"),
            "reporter_name": final_state["extracted_data"].get("reporter_name"),
            "reporter_email": final_state["extracted_data"].get("reporter_email"),
            "risk_assessment": final_state["risk_assessment"]
        }
    
    async def process_chat(self, message: str, complaint_id: Optional[int] = None) -> dict:
        """
        Process a general chat message.
        """
        chat_prompt = f"""
        User message: {message}
        
        Context: This is a pharmaceutical complaint management system.
        If the user is asking about a specific complaint, complaint_id is {complaint_id}.
        
        Provide a helpful response.
        """
        
        response = await self.llm.ainvoke([
            SystemMessage(content="You are a helpful AI assistant for a pharmaceutical complaint management system."),
            HumanMessage(content=chat_prompt)
        ])
        
        return {
            "response": response.content
        }
    
    def _parse_intent(self, state: ComplaintState) -> ComplaintState:
        """
        Parse the user's intent from the prompt.
        """
        state["response"] = "Intent parsed"
        return state
    
    def _extract_complaint_data(self, state: ComplaintState) -> ComplaintState:
        """
        Extract structured complaint data from the prompt.
        """
        extraction_prompt = f"""
        Extract structured complaint data from the following text.
        Return the result as a JSON object with these fields:
        - product_name (required)
        - product_strength (optional)
        - batch_number (optional)
        - manufacturing_date (optional)
        - expiry_date (optional)
        - affected_quantity (optional)
        - complaint_description (optional)
        - customer_name (optional)
        - customer_email (optional)
        - reporter_name (optional)
        - reporter_email (optional)
        
        Text to process: {state['prompt']}
        
        Return only the JSON object, no other text.
        """
        
        response = self.llm.invoke([
            SystemMessage(content="You are a data extraction specialist for pharmaceutical complaints."),
            HumanMessage(content=extraction_prompt)
        ])
        
        try:
            # Parse the JSON response
            extracted_data = json.loads(response.content)
            state["extracted_data"] = extracted_data
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            state["extracted_data"] = {
                "product_name": "Unknown",
                "complaint_description": state["prompt"]
            }
        
        return state
    
    def _assess_risk(self, state: ComplaintState) -> ComplaintState:
        """
        Assess the risk based on the extracted complaint data.
        """
        complaint_data = state["extracted_data"]
        
        risk_prompt = f"""
        Based on the following complaint data, perform a risk assessment:
        
        Complaint Data:
        {json.dumps(complaint_data, indent=2)}
        
        Provide a risk assessment with:
        - severity (Critical, Major, or Minor)
        - risk_level (High, Medium, or Low)
        - recommended_actions (list of 3-5 specific actions)
        - regulatory_impact (brief description)
        - quality_impact (brief description)
        - timeline_recommendation (specific timeline)
        - ai_reasoning (brief explanation of the assessment)
        
        Return as JSON object.
        """
        
        response = self.llm.invoke([
            SystemMessage(content="You are a pharmaceutical quality assurance expert specializing in risk assessment."),
            HumanMessage(content=risk_prompt)
        ])
        
        try:
            risk_assessment = json.loads(response.content)
            state["risk_assessment"] = risk_assessment
        except json.JSONDecodeError:
            # Fallback risk assessment
            state["risk_assessment"] = {
                "severity": "Major",
                "risk_level": "Medium",
                "recommended_actions": [
                    "Investigate the complaint",
                    "Review batch records",
                    "Contact customer for more information"
                ],
                "regulatory_impact": "Potential regulatory notification required",
                "quality_impact": "Quality system impact assessment needed",
                "timeline_recommendation": "Complete investigation within 30 days",
                "ai_reasoning": "Default risk assessment due to parsing error"
            }
        
        return state
    
    def _format_response(self, state: ComplaintState) -> ComplaintState:
        """
        Format the final response.
        """
        state["response"] = "Complaint processed successfully"
        return state