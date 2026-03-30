from pydantic import BaseModel
from typing import Optional

class DepartmentBase(BaseModel):
    name: str
    contact_info: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    contact_info: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    id: int
    
    class Config:
        from_attributes = True
