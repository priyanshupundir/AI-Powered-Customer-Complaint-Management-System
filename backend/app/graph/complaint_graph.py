from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from app.core.config import settings
from typing import TypedDict, Annotated, Optional
import operator
import json
import re


def _clean_json_str(text: str) -> str:
    """Clean markdown code block wrappers from LLM JSON responses."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return match.group(0)
    return text


class ComplaintState(TypedDict):
    prompt: str
    extracted_data: dict
    risk_assessment: dict
    response: str
    current_complaint: Optional[dict]


class ComplaintGraph:
    def __init__(self):
        # Initialize Groq LLM with fast & reliable model openai/gpt-oss-20b
        self.llm = ChatGroq(
            model="openai/gpt-oss-20b",
            api_key=settings.GROQ_API_KEY,
            temperature=0.1,
            max_tokens=600
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
        try:
            text_content = file_content.decode('utf-8', errors='ignore')
        except:
            text_content = str(file_content)
        
        extraction_prompt = f"""
        Extract complaint information from the following document content:
        
        File type: {file_type}
        Content: {text_content[:10000]}
        
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
        state["response"] = "Intent parsed"
        return state
    
    def _extract_complaint_data(self, state: ComplaintState) -> ComplaintState:
        extraction_prompt = f"""
        Extract structured complaint data from the following text.
        Return the result as a JSON object with these fields:
        - product_name (required string)
        - product_strength (optional string)
        - batch_number (optional string)
        - manufacturing_date (optional YYYY-MM-DD string)
        - expiry_date (optional YYYY-MM-DD string)
        - affected_quantity (optional string)
        - complaint_description (optional string)
        - customer_name (optional string)
        - customer_email (optional string)
        - reporter_name (optional string)
        - reporter_email (optional string)
        
        Text to process: {state['prompt']}
        
        Return ONLY valid JSON. Do not include extra text.
        """
        
        response = self.llm.invoke([
            SystemMessage(content="You are a data extraction specialist for pharmaceutical complaints. Return only JSON."),
            HumanMessage(content=extraction_prompt)
        ])
        
        try:
            cleaned_json = _clean_json_str(response.content)
            extracted_data = json.loads(cleaned_json)
            state["extracted_data"] = extracted_data
        except Exception as e:
            state["extracted_data"] = {
                "product_name": "Pharmaceutical Product",
                "complaint_description": state["prompt"]
            }
        
        return state
    
    def _assess_risk(self, state: ComplaintState) -> ComplaintState:
        complaint_data = state["extracted_data"]
        
        risk_prompt = f"""
        Based on the following complaint data, perform a risk assessment:
        
        Complaint Data:
        {json.dumps(complaint_data, indent=2)}
        
        Provide a risk assessment with:
        - severity (Critical, Major, or Minor)
        - risk_level (High, Medium, or Low)
        - recommended_actions (array of strings)
        - regulatory_impact (brief description)
        - quality_impact (brief description)
        - timeline_recommendation (specific timeline)
        - ai_reasoning (brief explanation of the assessment)
        
        Return ONLY valid JSON.
        """
        
        response = self.llm.invoke([
            SystemMessage(content="You are a pharmaceutical quality assurance expert specializing in risk assessment. Return only JSON."),
            HumanMessage(content=risk_prompt)
        ])
        
        try:
            cleaned_json = _clean_json_str(response.content)
            risk_assessment = json.loads(cleaned_json)
            state["risk_assessment"] = risk_assessment
        except Exception as e:
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
                "ai_reasoning": "Standard quality risk assessment"
            }
        
        return state
    
    def _format_response(self, state: ComplaintState) -> ComplaintState:
        state["response"] = "Complaint processed successfully"
        return state