#!/usr/bin/env python3
"""
Debug script to test imports
"""

import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent))

print("Testing imports...")

try:
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully")
except Exception as e:
    print(f"❌ FastAPI import failed: {e}")

try:
    from database.database import engine, Base
    print("✅ Database imported successfully")
except Exception as e:
    print(f"❌ Database import failed: {e}")

try:
    from routes import auth
    print("✅ Auth routes imported successfully")
except Exception as e:
    print(f"❌ Auth routes import failed: {e}")

try:
    from routes import complaints
    print("✅ Complaint routes imported successfully")
except Exception as e:
    print(f"❌ Complaint routes import failed: {e}")

try:
    from routes import users
    print("✅ User routes imported successfully")
except Exception as e:
    print(f"❌ User routes import failed: {e}")

try:
    from routes import departments
    print("✅ Department routes imported successfully")
except Exception as e:
    print(f"❌ Department routes import failed: {e}")

print("Import testing complete!")
