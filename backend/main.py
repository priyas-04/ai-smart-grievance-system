from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, complaints, users, departments
from database.database import engine
from database.database import Base

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
        "https://*.railway.app"
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
