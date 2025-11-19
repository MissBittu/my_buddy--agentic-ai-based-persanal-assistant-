from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
import uvicorn

# Import routes (we'll create these)
from app.routes import auth, goals, notes, files, tasks, spreadsheets, ai_chat

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Productivity Assistant",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Cosmic Assistant API! 🚀",
        "status": "active",
        "version": "1.0.0",
        "docs": "/api/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(files.router, prefix="/api/files", tags=["Files"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(spreadsheets.router, prefix="/api/spreadsheets", tags=["Spreadsheets"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Assistant"])

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

# Run server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )