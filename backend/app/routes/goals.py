"""
Goals Routes
Handles daily goals and long-term goals CRUD operations
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.auth import get_current_active_user
from app import models, schemas

router = APIRouter()

# ============================================
# DAILY GOALS
# ============================================

@router.get("/daily", response_model=List[schemas.DailyGoalResponse])
async def get_daily_goals(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all daily goals for current user
    """
    goals = db.query(models.DailyGoal).filter(
        models.DailyGoal.user_id == current_user.id
    ).order_by(models.DailyGoal.created_at.desc()).all()
    
    return goals

@router.post("/daily", response_model=schemas.DailyGoalResponse, status_code=status.HTTP_201_CREATED)
async def create_daily_goal(
    goal_data: schemas.DailyGoalCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new daily goal
    """
    # Use today's date if not provided
    if not goal_data.date:
        goal_data.date = datetime.now().strftime('%Y-%m-%d')
    
    new_goal = models.DailyGoal(
        user_id=current_user.id,
        text=goal_data.text,
        time=goal_data.time,
        date=goal_data.date,
        completed=False
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    return new_goal

@router.put("/daily/{goal_id}", response_model=schemas.DailyGoalResponse)
async def update_daily_goal(
    goal_id: int,
    goal_data: schemas.DailyGoalUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a daily goal
    """
    goal = db.query(models.DailyGoal).filter(
        models.DailyGoal.id == goal_id,
        models.DailyGoal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Update fields
    if goal_data.text is not None:
        goal.text = goal_data.text
    if goal_data.completed is not None:
        goal.completed = goal_data.completed
    if goal_data.time is not None:
        goal.time = goal_data.time
    if goal_data.date is not None:
        goal.date = goal_data.date
    
    goal.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(goal)
    
    return goal

@router.delete("/daily/{goal_id}")
async def delete_daily_goal(
    goal_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a daily goal
    """
    goal = db.query(models.DailyGoal).filter(
        models.DailyGoal.id == goal_id,
        models.DailyGoal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    db.delete(goal)
    db.commit()
    
    return {"message": "Goal deleted successfully", "success": True}

@router.post("/daily/{goal_id}/toggle")
async def toggle_daily_goal(
    goal_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Toggle goal completion status
    """
    goal = db.query(models.DailyGoal).filter(
        models.DailyGoal.id == goal_id,
        models.DailyGoal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    goal.completed = not goal.completed
    goal.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(goal)
    
    return goal

# ============================================
# LONG-TERM GOALS
# ============================================

@router.get("/longterm", response_model=List[schemas.LongTermGoalResponse])
async def get_longterm_goals(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all long-term goals for current user
    """
    goals = db.query(models.LongTermGoal).filter(
        models.LongTermGoal.user_id == current_user.id
    ).order_by(models.LongTermGoal.created_at.desc()).all()
    
    return goals

@router.post("/longterm", response_model=schemas.LongTermGoalResponse, status_code=status.HTTP_201_CREATED)
async def create_longterm_goal(
    goal_data: schemas.LongTermGoalCreate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new long-term goal
    """
    new_goal = models.LongTermGoal(
        user_id=current_user.id,
        title=goal_data.title,
        description=goal_data.description,
        target_date=goal_data.target_date,
        progress=0
    )
    
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    
    return new_goal

@router.put("/longterm/{goal_id}", response_model=schemas.LongTermGoalResponse)
async def update_longterm_goal(
    goal_id: int,
    goal_data: schemas.LongTermGoalUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a long-term goal
    """
    goal = db.query(models.LongTermGoal).filter(
        models.LongTermGoal.id == goal_id,
        models.LongTermGoal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    # Update fields
    if goal_data.title is not None:
        goal.title = goal_data.title
    if goal_data.description is not None:
        goal.description = goal_data.description
    if goal_data.target_date is not None:
        goal.target_date = goal_data.target_date
    if goal_data.progress is not None:
        goal.progress = goal_data.progress
    
    goal.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(goal)
    
    return goal

@router.delete("/longterm/{goal_id}")
async def delete_longterm_goal(
    goal_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a long-term goal
    """
    goal = db.query(models.LongTermGoal).filter(
        models.LongTermGoal.id == goal_id,
        models.LongTermGoal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    db.delete(goal)
    db.commit()
    
    return {"message": "Goal deleted successfully", "success": True}

@router.put("/longterm/{goal_id}/progress")
async def update_goal_progress(
    goal_id: int,
    progress: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update goal progress (0-100)
    """
    if progress < 0 or progress > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Progress must be between 0 and 100"
        )
    
    goal = db.query(models.LongTermGoal).filter(
        models.LongTermGoal.id == goal_id,
        models.LongTermGoal.user_id == current_user.id
    ).first()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    
    goal.progress = progress
    goal.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(goal)
    
    return goal