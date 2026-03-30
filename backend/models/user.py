from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
import enum

class UserRole(enum.Enum):
    CITIZEN = "citizen"
    OFFICER = "officer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.CITIZEN)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    
    department = relationship("Department", back_populates="officers")
    complaints = relationship("Complaint", back_populates="user")
