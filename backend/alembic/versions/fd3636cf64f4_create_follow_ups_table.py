"""create follow ups table

Revision ID: fd3636cf64f4
Revises: 7a51077792fb
Create Date: 2026-09-17 14:12:05.338424

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fd3636cf64f4"
down_revision: Union[str, Sequence[str], None] = "7a51077792fb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create follow_ups table."""

    op.create_table(
        "follow_ups",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("complaint_id", sa.String(length=50), nullable=False),
        sa.Column("scheduled_at", sa.DateTime(), nullable=False),
        sa.Column("follow_up_type", sa.String(length=50), nullable=False),
        sa.Column("priority", sa.String(length=30), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("outcome", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["complaint_id"],
            ["complaints.complaint_id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_follow_ups_complaint_id",
        "follow_ups",
        ["complaint_id"],
        unique=False,
    )

    op.create_index(
        "ix_follow_ups_id",
        "follow_ups",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    """Drop follow_ups table."""

    op.drop_index(
        "ix_follow_ups_id",
        table_name="follow_ups",
    )

    op.drop_index(
        "ix_follow_ups_complaint_id",
        table_name="follow_ups",
    )

    op.drop_table("follow_ups")