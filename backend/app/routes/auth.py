"""
Authentication Routes
Handles user registration, login, and profile management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.auth import (
    create_user,
    authenticate_user,
    create_access_token,
    get_current_active_user
)
from app import models

router = APIRouter()

# ============================================
# REGISTER
# ============================================

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user
    
    - **email**: Valid email address
    - **username**: Unique username (3-50 characters)
    - **password**: Password (min 8 characters)
    - **full_name**: Optional full name
    
    Returns user data and access token
    """
    try:
        # Create user
        user = create_user(
            db=db,
            email=user_data.email,
            username=user_data.username,
            password=user_data.password,
            full_name=user_data.full_name
        )
        
        # Create access token
        access_token = create_access_token(data={"sub": str(user.id)})
        
        # Return token and user data
        return Token(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.from_orm(user)
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

# ============================================
# LOGIN
# ============================================

@router.post("/login", response_model=Token)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Login with email and password
    
    - **email**: User email
    - **password**: User password
    
    Returns access token for authenticated requests
    """
    # Authenticate user
    user = authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

# ============================================
# GET CURRENT USER
# ============================================

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Get current authenticated user profile
    
    Requires: Bearer token in Authorization header
    """
    return UserResponse.from_orm(current_user)

# ============================================
# LOGOUT
# ============================================

@router.post("/logout")
async def logout(
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Logout current user
    
    Note: JWT tokens are stateless, so this is mainly for client-side cleanup.
    Client should delete the token from storage.
    """
    return {
        "message": "Successfully logged out",
        "success": True
    }

# ============================================
# UPDATE PROFILE
# ============================================

@router.put("/profile", response_model=UserResponse)
async def update_profile(
    full_name: str = None,
    avatar_url: str = None,
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile
    
    - **full_name**: Update full name
    - **avatar_url**: Update avatar URL
    """
    if full_name:
        current_user.full_name = full_name
    
    if avatar_url:
        current_user.avatar_url = avatar_url
    
    db.commit()
    db.refresh(current_user)
    
    return UserResponse.from_orm(current_user)

# ============================================
# DELETE ACCOUNT
# ============================================

@router.delete("/account")
async def delete_account(
    current_user: models.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete user account (soft delete - deactivate)
    
    This will deactivate the account but keep data for recovery.
    """
    current_user.is_active = False
    db.commit()
    
    return {
        "message": "Account deactivated successfully",
        "success": True
    }