from sqlalchemy.orm import Session
from database.database import SessionLocal, engine, Base
from models.department import Department
from models.user import User, UserRole
from auth.auth_handler import get_password_hash
import sys
from pathlib import Path
import hashlib

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent.parent))

def simple_hash(password):
    """Simple hash for testing (not for production!)"""
    return hashlib.sha256(password.encode()).hexdigest()

def seed_database():
    # Create all tables first
    from models.user import User
    from models.department import Department
    from models.complaint import Complaint
    
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Create departments
        departments_data = [
            {"name": "Water Department", "contact_info": "water@municipality.gov | 1800-WATER"},
            {"name": "Electricity Department", "contact_info": "electricity@municipality.gov | 1800-POWER"},
            {"name": "Road & Transport Department", "contact_info": "roads@municipality.gov | 1800-ROADS"},
            {"name": "Sanitation Department", "contact_info": "sanitation@municipality.gov | 1800-CLEAN"},
            {"name": "General Administration", "contact_info": "admin@municipality.gov | 1800-HELP"}
        ]
        
        for dept_data in departments_data:
            existing_dept = db.query(Department).filter(
                Department.name == dept_data["name"]
            ).first()
            if not existing_dept:
                db_dept = Department(**dept_data)
                db.add(db_dept)
        
        # Create admin user
        admin_email = "admin@resolveai.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                name="System Administrator",
                email=admin_email,
                password=simple_hash("admin123"),
                role=UserRole.ADMIN
            )
            db.add(admin_user)
        
        # Create sample officers
        officers_data = [
            {"name": "John Water", "email": "john.water@resolveai.com", "department": "Water Department"},
            {"name": "Sarah Power", "email": "sarah.power@resolveai.com", "department": "Electricity Department"},
            {"name": "Mike Roads", "email": "mike.roads@resolveai.com", "department": "Road & Transport Department"},
            {"name": "Lisa Clean", "email": "lisa.clean@resolveai.com", "department": "Sanitation Department"}
        ]
        
        for officer_data in officers_data:
            existing_officer = db.query(User).filter(
                User.email == officer_data["email"]
            ).first()
            if not existing_officer:
                dept = db.query(Department).filter(
                    Department.name == officer_data["department"]
                ).first()
                officer = User(
                    name=officer_data["name"],
                    email=officer_data["email"],
                    password=simple_hash("officer123"),
                    role=UserRole.OFFICER,
                    department_id=dept.id if dept else None
                )
                db.add(officer)
        
        # Create sample citizen
        citizen_email = "citizen@resolveai.com"
        existing_citizen = db.query(User).filter(User.email == citizen_email).first()
        if not existing_citizen:
            citizen = User(
                name="Sample Citizen",
                email=citizen_email,
                password=simple_hash("citizen123"),
                role=UserRole.CITIZEN
            )
            db.add(citizen)
        
        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
