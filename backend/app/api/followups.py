from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.complaint import Complaint
from app.models.follow_up import FollowUp
from app.models.user import User


router = APIRouter(
    prefix="/api/v1/follow-ups",
    tags=["Follow-ups"],
)


class FollowUpCreate(BaseModel):
    complaint_id: str
    scheduled_at: datetime
    follow_up_type: str
    priority: str = "Moderate"
    notes: str | None = None


class FollowUpUpdate(BaseModel):
    scheduled_at: datetime | None = None
    follow_up_type: str | None = None
    priority: str | None = None
    status: str | None = None
    notes: str | None = None
    outcome: str | None = None


def serialize_follow_up(follow_up: FollowUp):
    return {
        "id": follow_up.id,
        "complaint_id": follow_up.complaint_id,
        "scheduled_at": follow_up.scheduled_at,
        "follow_up_type": follow_up.follow_up_type,
        "priority": follow_up.priority,
        "status": follow_up.status,
        "notes": follow_up.notes,
        "outcome": follow_up.outcome,
        "created_at": follow_up.created_at,
        "updated_at": follow_up.updated_at,
    }


# ============================================================
# GET ALL FOLLOW-UPS
# ============================================================

@router.get("/")
def get_follow_ups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(FollowUp)
        .join(
            Complaint,
            Complaint.complaint_id == FollowUp.complaint_id,
        )
    )

    # Professionals and administrative users can access
    # the operational follow-up docket.
    #
    # Victims/users only see follow-ups belonging
    # to their own complaints.
    if current_user.role not in {
        "professional",
        "admin",
        "hq",
        "nodal",
    }:
        query = query.filter(
            Complaint.user_id == current_user.id
        )

    follow_ups = (
        query
        .order_by(FollowUp.scheduled_at.asc())
        .all()
    )

    return {
        "follow_ups": [
            serialize_follow_up(follow_up)
            for follow_up in follow_ups
        ]
    }


# ============================================================
# CREATE FOLLOW-UP
# ============================================================

@router.post("/")
def create_follow_up(
    data: FollowUpCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint_query = (
        db.query(Complaint)
        .filter(
            Complaint.complaint_id == data.complaint_id
        )
    )

    # Victims/users can only create follow-ups
    # for their own complaints.
    #
    # Professionals/admins can create follow-ups
    # for operational complaints.
    if current_user.role not in {
        "professional",
        "admin",
        "hq",
        "nodal",
    }:
        complaint_query = complaint_query.filter(
            Complaint.user_id == current_user.id
        )

    complaint = complaint_query.first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found.",
        )

    follow_up = FollowUp(
        complaint_id=data.complaint_id,
        scheduled_at=data.scheduled_at,
        follow_up_type=data.follow_up_type,
        priority=data.priority,
        status="scheduled",
        notes=data.notes,
    )

    db.add(follow_up)
    db.commit()
    db.refresh(follow_up)

    return {
        "message": "Follow-up scheduled successfully.",
        "follow_up": serialize_follow_up(follow_up),
    }


# ============================================================
# UPDATE FOLLOW-UP
# ============================================================

@router.patch("/{follow_up_id}")
def update_follow_up(
    follow_up_id: int,
    data: FollowUpUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(FollowUp)
        .join(
            Complaint,
            Complaint.complaint_id == FollowUp.complaint_id,
        )
        .filter(
            FollowUp.id == follow_up_id
        )
    )

    # Victims/users can only modify follow-ups
    # belonging to their own complaints.
    #
    # Professionals/admins can modify operational
    # follow-ups.
    if current_user.role not in {
        "professional",
        "admin",
        "hq",
        "nodal",
    }:
        query = query.filter(
            Complaint.user_id == current_user.id
        )

    follow_up = query.first()

    if not follow_up:
        raise HTTPException(
            status_code=404,
            detail="Follow-up not found.",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            follow_up,
            field,
            value,
        )

    db.commit()
    db.refresh(follow_up)

    return {
        "message": "Follow-up updated successfully.",
        "follow_up": serialize_follow_up(follow_up),
    }