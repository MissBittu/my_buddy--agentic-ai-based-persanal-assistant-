from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str
    REDIS_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    VAULT_ENCRYPTION_KEY: str
    
    # AI/ML
    LLM_MODEL: str = "llama3"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 2000
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    OLLAMA_URL: str = "http://localhost:11434"
    
    # Vector DB
    CHROMA_PATH: str = "./chroma_db"
    CHROMA_COLLECTION: str = "notiontablet_kb"
    RAG_TOP_K: int = 5
    RAG_SIMILARITY_THRESHOLD: float = 0.7
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    # Upload
    MAX_UPLOAD_SIZE: int = 10485760
    UPLOAD_DIR: str = "./uploads"
    
    class Config:
        env_file = ".env"

settings = Settings()