from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    def get_database_url(self) -> str:
        """Convert mysql:// to mysql+pymysql:// for SQLAlchemy"""
        if self.database_url.startswith("mysql://"):
            return self.database_url.replace("mysql://", "mysql+pymysql://", 1)
        return self.database_url
    
    class Config:
        env_file = ".env"

settings = Settings()
