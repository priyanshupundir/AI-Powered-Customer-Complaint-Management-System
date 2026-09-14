from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.complaint import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Chat with the AI assistant.
    Can be used for general queries or to interact with specific complaints.
    """
    try:
        chat_service = ChatService(db)
        result = await chat_service.process_chat_message(
            request.message, 
            request.complaint_id
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))