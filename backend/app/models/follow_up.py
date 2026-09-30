from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


class FollowUp(Base):
    __tablename__ = "follow_ups"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    complaint_id: Mapped[str] = mapped_column(
        ForeignKey("complaints.complaint_id"),
        nullable=False,
        index=True,
    )

    scheduled_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    follow_up_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    priority: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Moderate",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="scheduled",
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    outcome: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )