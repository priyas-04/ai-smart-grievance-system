from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import traceback

# Add backend to path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Debug information
print(f"Current working directory: {os.getcwd()}")
print(f"Backend path: {backend_path}")
print(f"Python path: {sys.path[:3]}")  # Show first 3 paths

# Try to import backend modules with detailed error reporting
try:
    print("Attempting to import backend modules...")
    
    # Test if backend directory exists
    if not os.path.exists(backend_path):
        raise FileNotFoundError(f"Backend directory not found at: {backend_path}")
    
    # List backend contents
    backend_files = os.listdir(backend_path)
    print(f"Backend directory contents: {backend_files}")
    
    # Import modules
    from routes import auth, complaints, users, departments
    from database.database import engine, Base
    
    print("✅ Backend modules imported successfully!")
    
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    
    app = FastAPI(
        title="ResolveAI - Smart Grievance System",
        description="AI-powered grievance management system with RBAC",
        version="1.0.0"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173", 
            "http://localhost:5174",
            "https://*.vercel.app",
            "https://*.railway.app",
            "https://*.onrender.com"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
    app.include_router(complaints.router, prefix="/api/complaints", tags=["Complaints"])
    app.include_router(users.router, prefix="/api/users", tags=["Users"])
    app.include_router(departments.router, prefix="/api/departments", tags=["Departments"])
    
    @app.get("/")
    async def root():
        return {"message": "ResolveAI API is running on Railway with MySQL", "status": "success"}
    
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "ResolveAI API", "database": "MySQL", "backend": "connected"}
    
    @app.get("/debug")
    async def debug_info():
        return {
            "working_directory": os.getcwd(),
            "backend_path": backend_path,
            "backend_exists": os.path.exists(backend_path),
            "backend_files": backend_files if 'backend_files' in locals() else [],
            "python_path": sys.path[:5],
            "environment": os.getenv("RAILWAY_ENVIRONMENT", "unknown")
        }
    
except Exception as e:
    print(f"❌ Import error: {e}")
    print(f"Full traceback: {traceback.format_exc()}")
    
    # Create a fallback app with detailed error info
    app = FastAPI(title="ResolveAI Debug Mode")
    
    @app.get("/")
    async def root():
        return {
            "message": "ResolveAI API - Debug Mode", 
            "error": str(e),
            "traceback": traceback.format_exc(),
            "working_directory": os.getcwd(),
            "backend_path": backend_path,
            "backend_exists": os.path.exists(backend_path)
        }
    
    @app.get("/health")
    async def health_check():
        return {
            "status": "error", 
            "service": "ResolveAI API", 
            "error": str(e),
            "traceback": traceback.format_exc()
        }
    
    @app.get("/debug")
    async def debug_info():
        return {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "working_directory": os.getcwd(),
            "backend_path": backend_path,
            "backend_exists": os.path.exists(backend_path),
            "python_path": sys.path[:5],
            "environment": os.getenv("RAILWAY_ENVIRONMENT", "unknown")
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
