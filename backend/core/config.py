from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os

class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    ALLOWED_ORIGINS: str = ""
    DATABASE_URL: str | None = None

    # Gemini / Vertex AI
    GCP_PROJECT_ID: str
    GCP_REGION: str = "us-central1"
    GEMINI_API_KEY: str

    @field_validator("ALLOWED_ORIGINS")
    def parse_allowed_origins(cls, v: str) -> List[str]:
        return v.split(",") if v else []

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
