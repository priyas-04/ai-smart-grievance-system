from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.complaint import ComplaintStatus, ComplaintPriority, ComplaintCategory

class ComplaintBase(BaseModel):
    title: str
    description: str

class ComplaintCreate(ComplaintBase):
    pass

class ComplaintUpdate(BaseModel):
    status: Optional[ComplaintStatus] = None
    remarks: Optional[str] = None

class ComplaintResponse(ComplaintBase):
    id: int
    category: ComplaintCategory
    priority: ComplaintPriority
    status: ComplaintStatus
    department_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    remarks: Optional[str] = None
    
    class Config:
        from_attributes = True

class ComplaintWithDepartment(ComplaintResponse):
    department_name: str
