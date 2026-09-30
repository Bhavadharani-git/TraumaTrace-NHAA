from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Body, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.models.complaint import Complaint
from app.models.user import User


router = APIRouter(
    prefix="/api/v1/complaints",
    tags=["Complaints"],
)


# ============================================================
# CONSTANTS
# ============================================================

OPERATIONAL_ROLES = {
    "professional",
    "admin",
    "hq",
    "nodal",
}


# ============================================================
# REQUEST SCHEMA
# ============================================================

class ComplaintCreate(BaseModel):
    language: str | None = None
    communication_method: str | None = None
    complaint_text: str | None = None
    transcript: str | None = None


# ============================================================
# HELPERS
# ============================================================

def generate_complaint_id() -> str:
    """
    Generate an NHAA complaint ID.

    Example:
        NHAA-CA2FC7A18A
    """
    return f"NHAA-{uuid4().hex[:10].upper()}"


def serialize_complaint(complaint: Complaint) -> dict:
    return {
        "id": complaint.id,
        "complaint_id": complaint.complaint_id,
        "user_id": complaint.user_id,
        "language": complaint.language,
        "communication_method": complaint.communication_method,
        "complaint_text": complaint.complaint_text,
        "transcript": complaint.transcript,
        "status": complaint.status,
        "created_at": complaint.created_at,
        "updated_at": complaint.updated_at,
    }


def is_operational_user(current_user: User) -> bool:
    return current_user.role in OPERATIONAL_ROLES


# ============================================================
# CREATE COMPLAINT
# ============================================================

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_complaint(
    complaint_data: ComplaintCreate | None = Body(default=None),

    # These query parameters are kept for compatibility with
    # the existing citizen frontend.
    complaint_text: str | None = Query(default=None),
    language: str | None = Query(default=None),
    communication_method: str | None = Query(default=None),
    transcript: str | None = Query(default=None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a complaint.

    Supports both:
    1. JSON body requests
    2. Existing query-parameter requests from the citizen portal
    """

    # Prefer JSON body when supplied.
    if complaint_data is not None:
        final_complaint_text = complaint_data.complaint_text
        final_language = complaint_data.language
        final_communication_method = complaint_data.communication_method
        final_transcript = complaint_data.transcript

    else:
        final_complaint_text = complaint_text
        final_language = language
        final_communication_method = communication_method
        final_transcript = transcript

    complaint = Complaint(
        complaint_id=generate_complaint_id(),
        user_id=current_user.id,
        language=final_language,
        communication_method=final_communication_method,
        complaint_text=final_complaint_text,
        transcript=final_transcript,
        status="received",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint submitted successfully.",
        "complaint": serialize_complaint(complaint),
    }


# ============================================================
# GET COMPLAINTS
# ============================================================

@router.get("/")
def get_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return complaints visible to the current user.

    Citizen/user:
        Only their own complaints.

    Professional/admin/HQ/nodal:
        Operational complaint docket containing all complaints.
    """

    query = db.query(Complaint)

    # --------------------------------------------------------
    # PROFESSIONAL / ADMIN / HQ / NODAL
    # --------------------------------------------------------
    # These users operate the NHAA case-management portal,
    # so they need the operational complaint docket.
    if not is_operational_user(current_user):
        query = query.filter(
            Complaint.user_id == current_user.id
        )

    complaints = (
        query
        .order_by(Complaint.created_at.desc())
        .all()
    )

    return {
        "complaints": [
            serialize_complaint(complaint)
            for complaint in complaints
        ]
    }


# ============================================================
# GET SINGLE COMPLAINT
# ============================================================

@router.get("/{complaint_id}")
def get_complaint_by_id(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get one complaint by NHAA complaint ID.

    Professionals/admins/HQ/nodal can access operational cases.

    Citizens can only access their own complaint.
    """

    query = db.query(Complaint).filter(
        Complaint.complaint_id == complaint_id
    )

    # Citizens/users are restricted to their own complaints.
    if not is_operational_user(current_user):
        query = query.filter(
            Complaint.user_id == current_user.id
        )

    complaint = query.first()

    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found.",
        )

    return {
        "complaint": serialize_complaint(complaint)
    }


# ============================================================
# UPDATE COMPLAINT STATUS
# ============================================================

@router.patch("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: str,

    # Supports:
    # PATCH /complaints/{id}/status?status=under_assessment
    status_value: str = Query(..., alias="status"),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update complaint status.

    Operational users can update any operational complaint.

    Citizens can only update their own complaint.
    """

    query = db.query(Complaint).filter(
        Complaint.complaint_id == complaint_id
    )

    # Restrict ordinary users to their own complaints.
    if not is_operational_user(current_user):
        query = query.filter(
            Complaint.user_id == current_user.id
        )

    complaint = query.first()

    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Complaint not found.",
        )

    complaint.status = status_value
    complaint.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint status updated successfully.",
        "complaint": serialize_complaint(complaint),
    }