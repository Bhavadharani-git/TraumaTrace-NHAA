"""create complaints table

Revision ID: 7a51077792fb
Revises: 832bdb51597e
Create Date: 2026-09-09 00:19:56.165632

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "7a51077792fb"
down_revision: Union[str, Sequence[str], None] = "832bdb51597e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create complaints table."""

    op.create_table(
        "complaints",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("complaint_id", sa.String(length=50), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("language", sa.String(length=30), nullable=True),
        sa.Column("communication_method", sa.String(length=30), nullable=True),
        sa.Column("complaint_text", sa.Text(), nullable=True),
        sa.Column("transcript", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=30), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("complaint_id"),
    )

    op.create_index(
        "ix_complaints_id",
        "complaints",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_complaints_complaint_id",
        "complaints",
        ["complaint_id"],
        unique=True,
    )

    op.create_index(
        "ix_complaints_user_id",
        "complaints",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Drop complaints table."""

    op.drop_index("ix_complaints_user_id", table_name="complaints")
    op.drop_index("ix_complaints_complaint_id", table_name="complaints")
    op.drop_index("ix_complaints_id", table_name="complaints")
    op.drop_table("complaints")