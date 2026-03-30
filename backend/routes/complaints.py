from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from database.database import get_db
from models.complaint import Complaint, ComplaintStatus, ComplaintPriority, ComplaintCategory
from models.user import User, UserRole
from models.department import Department
from schemas.complaint import ComplaintCreate, ComplaintResponse, ComplaintUpdate, ComplaintWithDepartment
from auth.dependencies import get_current_active_user, require_citizen_or_admin, require_officer_or_admin
from ai_models.smart_router import router as smart_router

router = APIRouter()

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint: ComplaintCreate,
    current_user: User = Depends(require_citizen_or_admin),
    db: Session = Depends(get_db)
):
    """Create a new complaint - Citizens and Admin only"""
    # Admin cannot submit complaints (as per requirements)
    if current_user.role == UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin users cannot submit complaints"
        )
    
    # Use AI to route the complaint
    routing_result = smart_router.route_complaint(complaint.description, db)
    
    # Additional priority check for urgent keywords
    if smart_router.is_high_priority(complaint.description):
        routing_result['priority'] = ComplaintPriority.HIGH
    
    # Create complaint object
    db_complaint = Complaint(
        title=complaint.title,
        description=complaint.description,
        category=routing_result['category'],
        priority=routing_result['priority'],
        department_id=routing_result['department_id'],
        user_id=current_user.id,
        status=ComplaintStatus.PENDING
    )
    
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    
    return db_complaint

@router.get("/", response_model=List[ComplaintWithDepartment])
async def get_complaints(
    status: Optional[ComplaintStatus] = Query(None),
    priority: Optional[ComplaintPriority] = Query(None),
    category: Optional[ComplaintCategory] = Query(None),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get complaints based on user role"""
    query = db.query(Complaint).join(Department)
    
    # Role-based filtering
    if current_user.role == UserRole.CITIZEN:
        # Citizens can only see their own complaints
        query = query.filter(Complaint.user_id == current_user.id)
    elif current_user.role == UserRole.OFFICER:
        # Officers can only see complaints for their department
        query = query.filter(Complaint.department_id == current_user.department_id)
    # Admin can see all complaints (no additional filtering)
    
    # Apply optional filters
    if status:
        query = query.filter(Complaint.status == status)
    if priority:
        query = query.filter(Complaint.priority == priority)
    if category:
        query = query.filter(Complaint.category == category)
    
    complaints = query.order_by(Complaint.created_at.desc()).all()
    
    # Add department name to each complaint
    result = []
    for complaint in complaints:
        complaint_dict = {
            'id': complaint.id,
            'title': complaint.title,
            'description': complaint.description,
            'category': complaint.category,
            'priority': complaint.priority,
            'status': complaint.status,
            'department_id': complaint.department_id,
            'user_id': complaint.user_id,
            'created_at': complaint.created_at,
            'updated_at': complaint.updated_at,
            'remarks': complaint.remarks,
            'department_name': complaint.department.name
        }
        result.append(ComplaintWithDepartment(**complaint_dict))
    
    return result

@router.get("/{complaint_id}", response_model=ComplaintWithDepartment)
async def get_complaint_by_id(
    complaint_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific complaint by ID"""
    complaint = db.query(Complaint).join(Department).filter(Complaint.id == complaint_id).first()
    
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    # Role-based access check
    if current_user.role == UserRole.CITIZEN and complaint.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this complaint"
        )
    elif current_user.role == UserRole.OFFICER and complaint.department_id != current_user.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this complaint"
        )
    
    complaint_dict = {
        'id': complaint.id,
        'title': complaint.title,
        'description': complaint.description,
        'category': complaint.category,
        'priority': complaint.priority,
        'status': complaint.status,
        'department_id': complaint.department_id,
        'user_id': complaint.user_id,
        'created_at': complaint.created_at,
        'updated_at': complaint.updated_at,
        'remarks': complaint.remarks,
        'department_name': complaint.department.name
    }
    
    return ComplaintWithDepartment(**complaint_dict)

@router.put("/{complaint_id}", response_model=ComplaintResponse)
async def update_complaint(
    complaint_id: int,
    complaint_update: ComplaintUpdate,
    current_user: User = Depends(require_officer_or_admin),
    db: Session = Depends(get_db)
):
    """Update complaint status and remarks - Officers and Admin only"""
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found"
        )
    
    # Role-based access check
    if current_user.role == UserRole.OFFICER and complaint.department_id != current_user.department_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this complaint"
        )
    
    # Update complaint fields
    update_data = complaint_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(complaint, field, value)
    
    db.commit()
    db.refresh(complaint)
    
    return complaint

@router.get("/stats/dashboard")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics based on user role"""
    query = db.query(Complaint)
    
    # Role-based filtering
    if current_user.role == UserRole.CITIZEN:
        query = query.filter(Complaint.user_id == current_user.id)
    elif current_user.role == UserRole.OFFICER:
        query = query.filter(Complaint.department_id == current_user.department_id)
    
    total_complaints = query.count()
    pending_complaints = query.filter(Complaint.status == ComplaintStatus.PENDING).count()
    in_progress_complaints = query.filter(Complaint.status == ComplaintStatus.IN_PROGRESS).count()
    resolved_complaints = query.filter(Complaint.status == ComplaintStatus.RESOLVED).count()
    high_priority_complaints = query.filter(Complaint.priority == ComplaintPriority.HIGH).count()
    
    return {
        "total_complaints": total_complaints,
        "pending": pending_complaints,
        "in_progress": in_progress_complaints,
        "resolved": resolved_complaints,
        "high_priority": high_priority_complaints,
        "resolution_rate": (resolved_complaints / total_complaints * 100) if total_complaints > 0 else 0
    }
