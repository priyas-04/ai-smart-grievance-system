from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Import backend modules
try:
    from routes import auth, complaints, users, departments
    from database.database import engine, Base
    
    # Create all database tables
    Base.metadata.create_all(bind=engine)
    
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
        return {"message": "ResolveAI API is running"}
    
    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "service": "ResolveAI API"}
    
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure all backend files are available")
    # Create a minimal app for testing
    app = FastAPI(title="ResolveAI Test")
    
    @app.get("/")
    async def root():
        return {"message": "ResolveAI API - Import error occurred", "error": str(e)}
    
    @app.get("/health")
    async def health_check():
        return {"status": "error", "service": "ResolveAI API", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
