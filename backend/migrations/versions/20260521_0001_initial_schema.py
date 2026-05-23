"""initial schema

Revision ID: 20260521_0001
Revises:
Create Date: 2026-05-21 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = "20260521_0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


equipment_type = postgresql.ENUM(
    "PANEL",
    "INVERTER",
    "BATTERY",
    "EV_CHARGER",
    name="equipmenttype",
)
role = postgresql.ENUM("ADMIN", "EDITOR", "VIEWER", name="role")


def upgrade() -> None:
    bind = op.get_bind()
    equipment_type.create(bind, checkfirst=True)
    role.create(bind, checkfirst=True)

    metadata = sa.MetaData()
    manufacturers = sa.Table(
        "manufacturers",
        metadata,
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("slug", sa.String(length=255), nullable=False),
        sa.Column("country", sa.String(length=100), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("founded_year", sa.Integer(), nullable=False),
        sa.Column("website", sa.String(length=500), nullable=False),
        sa.Column("logo_url", sa.String(length=500), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
    )
    users = sa.Table(
        "users",
        metadata,
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("role", role, nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
    )
    equipment = sa.Table(
        "equipment",
        metadata,
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("model_name", sa.String(length=255), nullable=False),
        sa.Column("equipment_type", equipment_type, nullable=False),
        sa.Column("manufacturer_id", sa.Integer(), nullable=False),
        sa.Column("power_rating_w", sa.Integer(), nullable=False),
        sa.Column("efficiency_percent", sa.Numeric(precision=5, scale=2), nullable=False),
        sa.Column("warranty_years", sa.Integer(), nullable=False),
        sa.Column("weight_kg", sa.Numeric(precision=8, scale=2), nullable=False),
        sa.Column("dimensions", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("price", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("certification", sa.String(length=500), nullable=False),
        sa.Column("release_year", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.String(length=500), nullable=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("extra_fields", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.ForeignKeyConstraint(["manufacturer_id"], ["manufacturers.id"]),
    )

    manufacturers.create(bind, checkfirst=True)
    users.create(bind, checkfirst=True)
    equipment.create(bind, checkfirst=True)
    op.create_index(
        op.f("ix_manufacturers_slug"),
        "manufacturers",
        ["slug"],
        unique=True,
        if_not_exists=True,
    )
    op.create_index(
        op.f("ix_users_email"), 
        "users", 
        ["email"], 
        unique=True, 
        if_not_exists=True
    )
    op.create_index(
        op.f("ix_equipment_equipment_type"),
        "equipment",
        ["equipment_type"],
        unique=False,
        if_not_exists=True,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_equipment_equipment_type"), table_name="equipment", if_exists=True)
    op.drop_index(op.f("ix_users_email"), table_name="users", if_exists=True)
    op.drop_index(op.f("ix_manufacturers_slug"), table_name="manufacturers", if_exists=True)
    op.drop_table("equipment", if_exists=True)
    op.drop_table("users", if_exists=True)
    op.drop_table("manufacturers", if_exists=True)
    role.drop(op.get_bind(), checkfirst=True)
    equipment_type.drop(op.get_bind(), checkfirst=True)
