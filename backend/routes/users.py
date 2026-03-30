from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.database import get_db
from models.user import User
from models.department import Department
from schemas.user import UserResponse, UserUpdate, UserCreate
from auth.dependencies import get_current_active_user, require_admin
from models.user import UserRole
from auth.auth_handler import get_password_hash, simple_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Add department name to current user info
    user_data = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "department_id": current_user.department_id,
        "department_name": None
    }
    
    if current_user.department_id:
        dept = db.query(Department).filter(Department.id == current_user.department_id).first()
        if dept:
            user_data["department_name"] = dept.name
    
    return user_data

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).all()
    
    # Add department name to each user
    result = []
    for user in users:
        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department_id": user.department_id,
            "department_name": None
        }
        
        if user.department_id:
            dept = db.query(Department).filter(Department.id == user.department_id).first()
            if dept:
                user_data["department_name"] = dept.name
        
        result.append(user_data)
    
    return result

@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Use simple hash for consistency with seeded data
    hashed_password = simple_hash(user.password)
    
    # Create new user
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        role=user.role,
        department_id=user.department_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    # Prevent admin from deleting themselves
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
