# Minimal FastAPI app for Render deployment
from fastapi import FastAPI
import os
import sys

# Simple app to test deployment
app = FastAPI(title="ResolveAI API")

@app.get("/")
async def root():
    return {"message": "ResolveAI API is running", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ResolveAI API"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
