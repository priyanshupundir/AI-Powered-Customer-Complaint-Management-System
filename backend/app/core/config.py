from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/complaint_db"
    
    # Groq API
    GROQ_API_KEY: str = ""
    
    # Application
    FRONTEND_URL: str = "http://localhost:5173"
    BACKEND_URL: str = "http://localhost:8000"
    ENVIRONMENT: str = "development"
    
    # Secret
    SECRET_KEY: str = "your_secret_key_here"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()