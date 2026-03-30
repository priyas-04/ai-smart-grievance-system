#!/usr/bin/env python3
"""
Fix officer department assignments
"""

from database.database import SessionLocal
from models.user import User
from models.department import Department

def fix_officer_departments():
    db = SessionLocal()
    
    try:
        # Get all departments
        departments = {dept.name: dept.id for dept in db.query(Department).all()}
        print('Department mapping:', departments)
        print()
        
        # Update all officers with correct department assignments
        officers = db.query(User).filter(User.role == 'officer').all()
        
        for officer in officers:
            if 'water' in officer.email.lower():
                officer.department_id = departments.get('Water Department')
                print(f'Updated {officer.name} to Water Department (ID: {departments.get("Water Department")})')
            elif 'power' in officer.email.lower() or 'electricity' in officer.email.lower():
                officer.department_id = departments.get('Electricity Department')
                print(f'Updated {officer.name} to Electricity Department (ID: {departments.get("Electricity Department")})')
            elif 'road' in officer.email.lower():
                officer.department_id = departments.get('Road & Transport Department')
                print(f'Updated {officer.name} to Road & Transport Department (ID: {departments.get("Road & Transport Department")})')
            elif 'clean' in officer.email.lower() or 'sanitation' in officer.email.lower():
                officer.department_id = departments.get('Sanitation Department')
                print(f'Updated {officer.name} to Sanitation Department (ID: {departments.get("Sanitation Department")})')
        
        db.commit()
        print('All officers updated successfully!')
        
    except Exception as e:
        print(f'Error: {e}')
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_officer_departments()
