"""
Notes Routes
Handles secret notes CRUD operations with AI auto-categorization
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
# GET ALL NOTES
# ============================================

@router.get("", response_model=List[schemas.NoteResponse])
async def get_notes(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title/content"),
    favorites_only: bool = Query(False, description="Show only favorites"),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all notes for current user with optional filters
    """
    query = db.query(models.Note).filter(
        models.Note.user_id == current_user.id
    )
    
    # Apply filters
    if category:
        query = query.filter(models.Note.category == category)
    
    if favorites_only:
        query = query.filter(models.Note.is_favorite == True)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (models.Note.title.ilike(search_term)) |
            (models.Note.content.ilike(search_term))
        )
    
    notes = query.order_by(models.Note.updated_at.desc()).all()
    return notes

# ============================================
# GET SINGLE NOTE
# ============================================

@router.get("/{note_id}", response_model=schemas.NoteResponse)
async def get_note(
    note_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific note by ID
    """
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    return note

# ============================================
# CREATE NOTE
# ============================================

@router.post("", response_model=schemas.NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    note_data: schemas.NoteCreate,
    auto_categorize: bool = Query(False, description="Use AI to auto-categorize"),
    auto_tags: bool = Query(False, description="Use AI to extract tags"),
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Create a new note with optional AI categorization
    """
    # AI auto-categorization
    category = note_data.category
    tags = note_data.tags
    
    if auto_categorize and note_data.content:
        try:
            ai = get_ai_service()
            categories = ["Personal", "Work", "Ideas"]
            category = await ai.auto_categorize(
                note_data.content[:500], 
                categories
            )
        except Exception as e:
            print(f"Auto-categorize failed: {e}")
    
    # AI tag extraction
    if auto_tags and note_data.content and not tags:
        try:
            ai = get_ai_service()
            tags = await ai.extract_tags(note_data.content[:500])
        except Exception as e:
            print(f"Tag extraction failed: {e}")
    
    new_note = models.Note(
        user_id=current_user.id,
        title=note_data.title,
        content=note_data.content,
        category=category,
        tags=tags,
        is_favorite=False,
        is_locked=note_data.is_locked
    )
    
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    
    return new_note

# ============================================
# UPDATE NOTE
# ============================================

@router.put("/{note_id}", response_model=schemas.NoteResponse)
async def update_note(
    note_id: int,
    note_data: schemas.NoteUpdate,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update a note
    """
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    # Update fields
    if note_data.title is not None:
        note.title = note_data.title
    if note_data.content is not None:
        note.content = note_data.content
    if note_data.category is not None:
        note.category = note_data.category
    if note_data.tags is not None:
        note.tags = note_data.tags
    if note_data.is_favorite is not None:
        note.is_favorite = note_data.is_favorite
    if note_data.is_locked is not None:
        note.is_locked = note_data.is_locked
    
    note.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(note)
    
    return note

# ============================================
# DELETE NOTE
# ============================================

@router.delete("/{note_id}")
async def delete_note(
    note_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a note
    """
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    db.delete(note)
    db.commit()
    
    return {"message": "Note deleted successfully", "success": True}

# ============================================
# TOGGLE FAVORITE
# ============================================

@router.post("/{note_id}/favorite")
async def toggle_favorite(
    note_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Toggle note favorite status
    """
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    note.is_favorite = not note.is_favorite
    note.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(note)
    
    return note

# ============================================
# CATEGORIZE NOTE (AI)
# ============================================

@router.post("/{note_id}/categorize")
async def ai_categorize_note(
    note_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Use AI to categorize a note
    """
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    if not note.content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Note has no content to categorize"
        )
    
    try:
        ai = get_ai_service()
        categories = ["Personal", "Work", "Ideas"]
        category = await ai.auto_categorize(note.content[:500], categories)
        
        note.category = category
        note.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(note)
        
        return {
            "success": True,
            "category": category,
            "note": note
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Categorization failed: {str(e)}"
        )

# ============================================
# EXTRACT TAGS (AI)
# ============================================

@router.post("/{note_id}/extract-tags")
async def extract_tags(
    note_id: int,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Use AI to extract tags from note content
    """
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    
    if not note.content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Note has no content to extract tags from"
        )
    
    try:
        ai = get_ai_service()
        tags = await ai.extract_tags(note.content[:500])
        
        note.tags = tags
        note.updated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(note)
        
        return {
            "success": True,
            "tags": tags,
            "note": note
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Tag extraction failed: {str(e)}"
        )