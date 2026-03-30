#!/usr/bin/env python3
"""
Minimal FastAPI server to test basic functionality
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
from pathlib import Path

# Add parent directory to Python path
sys.path.append(str(Path(__file__).parent))

app = FastAPI(
    title="ResolveAI - Smart Grievance System",
    description="AI-powered grievance management system with RBAC",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ResolveAI API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ResolveAI API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
