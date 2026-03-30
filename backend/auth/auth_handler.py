from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from config.settings import settings
from schemas.user import TokenData
from models.user import UserRole
import hashlib

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def simple_hash(password: str) -> str:
    """Simple hash for testing (not for production!)"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Check if it's a simple hash (starts with hex characters)
    if len(hashed_password) == 64 and all(c in '0123456789abcdef' for c in hashed_password.lower()):
        return simple_hash(plain_password) == hashed_password
    # Otherwise use bcrypt
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def verify_token(token: str) -> Optional[TokenData]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None or role is None:
            return None
        token_data = TokenData(email=email, role=UserRole(role))
        return token_data
    except JWTError:
        return None
