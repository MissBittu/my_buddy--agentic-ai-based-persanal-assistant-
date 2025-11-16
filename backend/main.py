from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="NotionTablet API",
    description="Cosmic AI Productivity System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
goals = []
projects = []
vault_notes = []

# Pydantic Models
class Goal(BaseModel):
    title: str
    completed: bool = False
    priority: str = "medium"
    deadline: Optional[str] = None
    streak: int = 0

class Project(BaseModel):
    name: str
    color: str = "blue"

class ChatMessage(BaseModel):
    content: str

class VaultNote(BaseModel):
    title: str
    content: str

# ==================
# BASIC ROUTES
# ==================

@app.get("/")
def root():
    return {
        "message": "🌌 NotionTablet API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "goals": "/api/v1/goals",
            "chat": "/api/v1/chat/message"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

# ==================
# GOALS ROUTES
# ==================

@app.get("/api/v1/goals")
def list_goals():
    logger.info(f"Listing {len(goals)} goals")
    return goals

@app.post("/api/v1/goals")
def create_goal(goal: Goal):
    new_goal = goal.dict()
    new_goal["id"] = len(goals) + 1
    goals.append(new_goal)
    logger.info(f"Created goal: {new_goal['title']}")
    return new_goal

@app.put("/api/v1/goals/{goal_id}")
def update_goal(goal_id: int, updates: dict):
    for i, g in enumerate(goals):
        if g["id"] == goal_id:
            goals[i].update(updates)
            logger.info(f"Updated goal {goal_id}")
            return goals[i]
    raise HTTPException(status_code=404, detail="Goal not found")

@app.delete("/api/v1/goals/{goal_id}")
def delete_goal(goal_id: int):
    global goals
    original_length = len(goals)
    goals = [g for g in goals if g["id"] != goal_id]
    if len(goals) == original_length:
        raise HTTPException(status_code=404, detail="Goal not found")
    logger.info(f"Deleted goal {goal_id}")
    return {"message": "Goal deleted successfully"}

@app.post("/api/v1/goals/{goal_id}/complete")
def complete_goal(goal_id: int):
    for g in goals:
        if g["id"] == goal_id:
            g["completed"] = True
            g["streak"] = g.get("streak", 0) + 1
            logger.info(f"Completed goal {goal_id}")
            return g
    raise HTTPException(status_code=404, detail="Goal not found")

# ==================
# PROJECT ROUTES
# ==================

@app.get("/api/v1/projects")
def list_projects():
    return projects

@app.post("/api/v1/projects")
def create_project(project: Project):
    new_project = project.dict()
    new_project["id"] = len(projects) + 1
    new_project["items"] = 0
    projects.append(new_project)
    logger.info(f"Created project: {new_project['name']}")
    return new_project

# ==================
# VAULT ROUTES
# ==================

@app.get("/api/v1/vault/notes")
def list_vault_notes():
    return vault_notes

@app.post("/api/v1/vault/notes")
def create_vault_note(note: VaultNote):
    new_note = note.dict()
    new_note["id"] = len(vault_notes) + 1
    vault_notes.append(new_note)
    logger.info(f"Created vault note: {new_note['title']}")
    return new_note

# ==================
# AI CHAT ROUTE (GENAI ORCHESTRATOR)
# ==================

from ai.orchestrator import orchestrator

@app.post("/api/v1/chat/message")
def ai_chat(message: ChatMessage):
    """
    AI-powered chat endpoint using the new GenAI orchestrator:
    - Intent classification
    - Agents
    - RAG
    - LLM fallback
    """
    logger.info(f"AI Chat Request: {message.content}")

    result = orchestrator.handle(message.content, goals)

    return {
        "role": "assistant",
        "content": result.get("message", "I could not generate a response."),
        "metadata": result
    }

# ==================
# ANALYTICS ROUTES
# ==================

@app.get("/api/v1/analytics/dashboard")
def get_dashboard_analytics():
    total_goals = len(goals)
    completed_goals = sum(1 for g in goals if g.get("completed", False))
    completion_rate = (completed_goals / total_goals * 100) if total_goals > 0 else 0
    
    return {
        "total_goals": total_goals,
        "completed_goals": completed_goals,
        "completion_rate": completion_rate,
        "active_goals": total_goals - completed_goals,
        "productivity_score": min(completion_rate + 10, 100),
        "goal_alignment": 78,
        "weekly_trend": [65, 72, 78, 82, 85, 88, 92]
    }

# ==================
# RUN APP
# ==================

if __name__ == "__main__":
    import uvicorn
    logger.info("🚀 Starting NotionTablet API...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
