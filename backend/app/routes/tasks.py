"""
Tasks Routes
Handles tasks CRUD operations with AI-powered scheduling
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database import get_db
from app.auth import get_current_active_user
from app import models, schemas
from ai.ai_service import get_ai_service

router = APIRouter()

# ============================================
# GET ALL TASKS
# ============================================

@router.get("", response_model=List[schemas.TaskResponse])
async def get_tasks(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[int] = Query(None, ge=1, le=5, description="Filter by priority"),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all tasks for current user with optional filters
    """
    query = db.query(models.Task).filter(
        models.Task.user_id == current_user.id
    )
    
    if status_filter:
        query = query.filter(models.Task.status == status_filter)
    
    if priority:
        query = query.filter(models.Task.priority == priority)
    
    tasks = query.order_by(
        models.Task.deadline.asc(),
        models.Task.priority.desc()
    ).all()
    
    return tasks

# ============================================
# GET SINGLE TASK
# ============================================

@router.get("/{task_id}", response_model=schemas.TaskResponse)
async def get_task(
    task_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific task by ID
    """
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task

# ============================================
# CREATE TASK
# ============================================

@router.post("", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: schemas.TaskCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new task
    """
    new_task = models.Task(
        user_id=current_user.id,
        title=task_data.title,
        description=task_data.description,
        priority=task_data.priority,
        deadline=task_data.deadline,
        scheduled_time=task_data.scheduled_time,
        duration=task_data.duration,
        status="pending"
    )
    
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    return new_task

# ============================================
# UPDATE TASK
# ============================================

@router.put("/{task_id}", response_model=schemas.TaskResponse)
async def update_task(
    task_id: int,
    task_data: schemas.TaskUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a task
    """
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update fields
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.priority is not None:
        task.priority = task_data.priority
    if task_data.deadline is not None:
        task.deadline = task_data.deadline
    if task_data.scheduled_time is not None:
        task.scheduled_time = task_data.scheduled_time
    if task_data.duration is not None:
        task.duration = task_data.duration
    if task_data.status is not None:
        task.status = task_data.status
    
    task.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    
    return task

# ============================================
# DELETE TASK
# ============================================

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a task
    """
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db.delete(task)
    db.commit()
    
    return {"message": "Task deleted successfully", "success": True}

# ============================================
# UPDATE TASK STATUS
# ============================================

@router.patch("/{task_id}/status")
async def update_task_status(
    task_id: int,
    new_status: str = Query(..., regex="^(pending|in_progress|completed)$"),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update task status (pending, in_progress, completed)
    """
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    task.status = new_status
    task.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(task)
    
    return task

# ============================================
# AUTO-SCHEDULE TASKS (AI)
# ============================================

@router.post("/auto-schedule")
async def auto_schedule_tasks(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Use AI to automatically optimize task schedule
    """
    # Get all pending tasks
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.status.in_(["pending", "in_progress"])
    ).all()
    
    if not tasks:
        return {
            "message": "No pending tasks to schedule",
            "success": True
        }
    
    try:
        # Prepare task data for AI
        tasks_data = [
            {
                "id": task.id,
                "title": task.title,
                "priority": task.priority,
                "deadline": task.deadline,
                "duration": task.duration,
                "scheduled_time": task.scheduled_time
            }
            for task in tasks
        ]
        
        workload_info = {
            "total_tasks": len(tasks),
            "high_priority": len([t for t in tasks if t.priority >= 4]),
            "available_hours": 8  # Default working hours
        }
        
        # Get AI recommendations
        ai = get_ai_service()
        result = await ai.smart_schedule(tasks_data, workload_info)
        
        # Update tasks with new schedule if AI provides it
        if "optimized_schedule" in result:
            for task_update in result["optimized_schedule"]:
                task_id = task_update.get("id")
                new_time = task_update.get("scheduled_time")
                
                if task_id and new_time:
                    task = db.query(models.Task).filter(
                        models.Task.id == task_id
                    ).first()
                    
                    if task:
                        task.scheduled_time = new_time
                        task.auto_rescheduled = True
                        task.updated_at = datetime.utcnow()
            
            db.commit()
        
        return {
            "success": True,
            "message": "Tasks rescheduled successfully",
            "schedule": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Auto-scheduling failed: {str(e)}"
        )

# ============================================
# GET OVERDUE TASKS
# ============================================

@router.get("/overdue/list", response_model=List[schemas.TaskResponse])
async def get_overdue_tasks(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all overdue tasks
    """
    today = datetime.now().strftime('%Y-%m-%d')
    
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.status != "completed",
        models.Task.deadline < today
    ).order_by(models.Task.deadline.asc()).all()
    
    return tasks

# ============================================
# GET TODAY'S TASKS
# ============================================

@router.get("/today/list", response_model=List[schemas.TaskResponse])
async def get_today_tasks(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all tasks due today
    """
    today = datetime.now().strftime('%Y-%m-%d')
    
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.deadline == today
    ).order_by(
        models.Task.priority.desc(),
        models.Task.scheduled_time.asc()
    ).all()
    
    return tasks