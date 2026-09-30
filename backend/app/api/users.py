from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


OPERATIONAL_ROLES = {
    "admin",
    "professional",
    "hq",
    "nodal",
}


def serialize_user(user: User) -> dict:
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


@router.get("/")
def get_users(
    role: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in OPERATIONAL_ROLES:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access users.",
        )

    query = db.query(User)

    if role:
        query = query.filter(User.role == role)

    users = (
        query
        .order_by(User.full_name.asc())
        .all()
    )

    return {
        "users": [
            serialize_user(user)
            for user in users
        ]
    }


@router.get("/{user_id}")
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in OPERATIONAL_ROLES:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to access users.",
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return {
        "user": serialize_user(user)
    }