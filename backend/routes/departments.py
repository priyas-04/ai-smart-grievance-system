from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from models.department import Department
from models.user import User
from schemas.department import DepartmentResponse, DepartmentCreate, DepartmentUpdate
from auth.dependencies import require_admin

router = APIRouter()

@router.get("/", response_model=List[DepartmentResponse])
async def get_all_departments(db: Session = Depends(get_db)):
    departments = db.query(Department).all()
    return departments

@router.post("/", response_model=DepartmentResponse)
async def create_department(
    department: DepartmentCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    # Check if department already exists
    existing_dept = db.query(Department).filter(Department.name == department.name).first()
    if existing_dept:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department already exists"
        )
    
    db_department = Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department_by_id(
    department_id: int,
    db: Session = Depends(get_db)
):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    return department

@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int,
    department_update: DepartmentUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    update_data = department_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(department, field, value)
    
    db.commit()
    db.refresh(department)
    return department

@router.delete("/{department_id}")
async def delete_department(
    department_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    # Check if department has users
    users_in_dept = db.query(User).filter(User.department_id == department_id).count()
    if users_in_dept > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete department with {users_in_dept} assigned users"
        )
    
    department = db.query(Department).filter(Department.id == department_id).first()
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    
    db.delete(department)
    db.commit()
    return {"message": "Department deleted successfully"}
