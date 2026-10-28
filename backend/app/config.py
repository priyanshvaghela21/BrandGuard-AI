import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "BrandGuard Autonomous Brand Review & Governance API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/brandguard_db"
    )
    
    # JWT Authentication
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "brandguard-autonomous-governance-secret-key-2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Google Gemini API
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    # Inkloom AI ($100 Hackathon Early Access Credits)
    INKLOOM_API_KEY: str = os.getenv("INKLOOM_API_KEY", "")
    INKLOOM_API_URL: str = os.getenv("INKLOOM_API_URL", "https://inkloom.art/api/v1")
    INKLOOM_MEMBER_EMAIL: str = os.getenv("INKLOOM_MEMBER_EMAIL", "priyanshvaghela4@gmail.com")
    INKLOOM_TOTAL_CREDITS: float = float(os.getenv("INKLOOM_TOTAL_CREDITS", "100.0"))
    
    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip() 
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")
        if origin.strip()
    ]

settings = Settings()
