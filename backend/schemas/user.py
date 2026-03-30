from pydantic import BaseModel, EmailStr
from typing import Optional
from models.user import UserRole

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.CITIZEN
    department_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    department_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[UserRole] = None
