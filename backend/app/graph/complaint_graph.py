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
    
    async def process_edit_complaint(self, prompt: str, current_data: dict) -> dict:
        """
        Process an edit complaint request cleanly.
        """
        # Ensure current_data is clean without ORM metadata
        clean_current = {k: v for k, v in current_data.items() if not k.startswith('_')}
        
        edit_prompt = f"""You are a pharmaceutical complaint editor assistant.
CURRENT COMPLAINT DATA:
{json.dumps(clean_current, indent=2)}

USER EDIT INSTRUCTION:
"{prompt}"

Update the fields requested by the user. Keep all unchanged fields intact from the CURRENT COMPLAINT DATA.
Return ONLY a valid JSON object with these exact keys:
- product_name (string)
- product_strength (string or null)
- batch_number (string or null)
- manufacturing_date (YYYY-MM-DD string or null)
- expiry_date (YYYY-MM-DD string or null)
- affected_quantity (string or null)
- complaint_description (string or null)
- customer_name (string or null)
- customer_email (string or null)
- reporter_name (string or null)
- reporter_email (string or null)
"""

        response = await self.llm.ainvoke([
            SystemMessage(content="You are an expert AI data editor for pharmaceutical complaints. Return ONLY valid JSON."),
            HumanMessage(content=edit_prompt)
        ])
        
        try:
            cleaned_json = _clean_json_str(response.content)
            extracted_updates = json.loads(cleaned_json)
        except Exception:
            extracted_updates = {}
        
        # Merge updates over existing data
        merged_data = dict(clean_current)
        for k, v in extracted_updates.items():
            if v is not None and v != "" and k in merged_data:
                merged_data[k] = v
        
        # Perform risk assessment on updated complaint data
        dummy_state = {"extracted_data": merged_data, "risk_assessment": {}}
        assessed_state = self._assess_risk(dummy_state)
        
        return {
            "complaint_updates": merged_data,
            "extracted_data": merged_data,
            "risk_assessment": assessed_state["risk_assessment"]
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
        batch numbers, dates, quantities, customer name/email, and reporter name/email.
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
        Extract structured complaint data from the text.
        Return a JSON object with these fields:
        - product_name (required string: name of medicine or product)
        - product_strength (optional string: e.g. 500mg)
        - batch_number (optional string: e.g. BATCH-1234)
        - manufacturing_date (optional YYYY-MM-DD string)
        - expiry_date (optional YYYY-MM-DD string)
        - affected_quantity (optional string: e.g. 150 bottles)
        - complaint_description (optional string: description of physical defect, color, odor, issue)
        - customer_name (optional string: entity, pharmacy, hospital, client, or company reporting or experiencing the issue)
        - customer_email (optional string: email address of customer/pharmacy/company)
        - reporter_name (optional string: person, doctor, manager, or individual filing the report)
        - reporter_email (optional string: email address of reporter)
        
        Text to process: {state['prompt']}
        
        Return ONLY valid JSON.
        """
        
        response = self.llm.invoke([
            SystemMessage(content="You are an expert AI data extraction specialist for pharmaceutical complaints. Carefully extract customer_name, customer_email, reporter_name, and reporter_email whenever mentioned. Return ONLY JSON."),
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