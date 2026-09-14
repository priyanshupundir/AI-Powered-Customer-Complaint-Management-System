from sqlalchemy.orm import Session
from app.models.complaint import ChatHistory
from app.schemas.complaint import ChatResponse, ComplaintResponse, RiskAssessmentResponse
from app.graph.complaint_graph import ComplaintGraph
from typing import Optional


class ChatService:
    def __init__(self, db: Session):
        self.db = db
        self.complaint_graph = ComplaintGraph()
    
    async def process_chat_message(
        self, 
        message: str, 
        complaint_id: Optional[int] = None
    ) -> ChatResponse:
        """
        Process a chat message and generate AI response.
        """
        # Use LangGraph to process the chat message
        response_data = await self.complaint_graph.process_chat(message, complaint_id)
        
        # Save chat history
        chat_message = ChatHistory(
            complaint_id=complaint_id,
            user_message=message,
            ai_response=response_data.get("response", "")
        )
        self.db.add(chat_message)
        self.db.commit()
        
        # Build response
        chat_response = ChatResponse(
            response=response_data.get("response", "")
        )
        
        # If there are complaint updates, include them
        if "complaint_updates" in response_data:
            # This would require fetching and updating the actual complaint
            # For now, we'll return the data as-is
            pass
        
        return chat_response