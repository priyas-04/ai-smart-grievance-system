from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from database.database import Base

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    contact_info = Column(Text, nullable=True)
    
    officers = relationship("User", back_populates="department")
    complaints = relationship("Complaint", back_populates="department")
