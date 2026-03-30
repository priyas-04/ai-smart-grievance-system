from sqlalchemy.orm import Session
from models.complaint import Complaint, ComplaintStatus
from models.user import User, UserRole
from typing import List, Optional
from datetime import datetime, timedelta

class ComplaintService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_overdue_complaints(self, days: int = 7) -> List[Complaint]:
        """Get complaints that are pending for more than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return self.db.query(Complaint).filter(
            Complaint.status == ComplaintStatus.PENDING,
            Complaint.created_at < cutoff_date
        ).all()
    
    def get_high_priority_pending(self) -> List[Complaint]:
        """Get all high priority pending complaints"""
        return self.db.query(Complaint).filter(
            Complaint.status == ComplaintStatus.PENDING
        ).order_by(Complaint.created_at).all()
    
    def auto_escalate_overdue(self, days: int = 7):
        """Auto-escalate overdue complaints to high priority"""
        overdue = self.get_overdue_complaints(days)
        escalated_count = 0
        
        for complaint in overdue:
            if complaint.priority.value != 'high':
                complaint.priority = ComplaintPriority.HIGH
                escalated_count += 1
        
        self.db.commit()
        return escalated_count
    
    def get_resolution_metrics(self, department_id: Optional[int] = None) -> dict:
        """Get resolution metrics for dashboard"""
        query = self.db.query(Complaint)
        
        if department_id:
            query = query.filter(Complaint.department_id == department_id)
        
        total = query.count()
        resolved = query.filter(Complaint.status == ComplaintStatus.RESOLVED).count()
        
        # Calculate average resolution time
        resolved_complaints = query.filter(Complaint.status == ComplaintStatus.RESOLVED).all()
        if resolved_complaints:
            total_resolution_time = sum(
                (c.updated_at - c.created_at).days for c in resolved_complaints
            )
            avg_resolution_time = total_resolution_time / len(resolved_complaints)
        else:
            avg_resolution_time = 0
        
        return {
            "total_complaints": total,
            "resolved_complaints": resolved,
            "resolution_rate": (resolved / total * 100) if total > 0 else 0,
            "average_resolution_days": avg_resolution_time
        }
