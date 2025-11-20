from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "Cosmic Assistant"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str
    
    # AI APIs
    GROQ_API_KEY: str
    OPENAI_API_KEY: str = ""  # Optional
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://your-app.vercel.app"
    ]
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB
    ALLOWED_FILE_TYPES: List[str] = [
        "pdf", "png", "jpg", "jpeg", "txt", 
        "doc", "docx", "xls", "xlsx", "csv"
    ]
    
    # Redis (Optional)
    REDIS_URL: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Groq Configuration
GROQ_MODEL = "mixtral-8x7b-32768"  # FREE and FAST!
GROQ_MAX_TOKENS = 4096
GROQ_TEMPERATURE = 0.7

# Embedding Model (FREE - runs locally)
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Small, fast, accurate