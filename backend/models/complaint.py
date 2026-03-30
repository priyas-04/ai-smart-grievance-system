from sqlalchemy import Column, Integer, String, Text, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base
import enum

class ComplaintStatus(enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"

class ComplaintPriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class ComplaintCategory(enum.Enum):
    WATER = "water"
    ELECTRICITY = "electricity"
    ROAD_TRANSPORT = "road_transport"
    SANITATION = "sanitation"
    GENERAL = "general"

class Complaint(Base):
    __tablename__ = "complaints"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(ComplaintCategory), nullable=False)
    priority = Column(Enum(ComplaintPriority), nullable=False)
    status = Column(Enum(ComplaintStatus), default=ComplaintStatus.PENDING)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    remarks = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="complaints")
    department = relationship("Department", back_populates="complaints")
