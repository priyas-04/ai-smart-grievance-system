import sys
import os

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change to backend directory to access all modules
os.chdir(backend_path)

# Import and run the main application
if __name__ == "__main__":
    # Import the app from the backend main module
    from main import app
    import uvicorn
    
    # Get port from environment or default to 8001
    port = int(os.environ.get("PORT", 8001))
    
    # Run the application
    uvicorn.run(app, host="0.0.0.0", port=port)
