from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.jwt import create_access_token
from app.core.security import hash_password, verify_password
from app.db.dependencies import get_db
from app.api.dependencies import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    full_name: str,
    email: str,
    password: str,
    db: Session = Depends(get_db),
):
    existing_user = db.scalar(
        select(User).where(User.email == email)
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered.",
        )

    user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role="victim",
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Registration successful.",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
        },
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db),
):
    normalized_email = email.strip().lower()

    user = db.scalar(
        select(User).where(
            User.email == normalized_email
        )
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(
        password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )

    # --------------------------------------------------------
    # Direct prototype login
    # --------------------------------------------------------

    access_token = create_access_token(
        user_id=user.id,
        role=user.role,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
        },
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
    }