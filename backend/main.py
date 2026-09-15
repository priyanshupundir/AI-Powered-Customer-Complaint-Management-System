from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.core.config import settings
from app.core.database import engine, Base
from app.api import complaints, chat, bonus_features

# Create database tables (only if not in production with managed database)
if os.getenv("ENVIRONMENT") != "production":
    Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI-Powered Customer Complaint Management System",
    description="An AI-powered complaint management system for pharmaceutical companies",
    version="1.0.0"
)

# Configure CORS - allow all origins in development, specific ones in production
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
if os.getenv("ENVIRONMENT") == "production":
    # In production, allow specific domains
    allow_origins = [frontend_url]
else:
    # In development, allow all for testing
    allow_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(complaints.router, prefix="/api/complaint", tags=["complaints"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(bonus_features.router, prefix="/api/bonus", tags=["bonus-features"])


@app.get("/")
def read_root():
    return {
        "message": "AI-Powered Customer Complaint Management System API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)