import enum
from decimal import Decimal

from sqlalchemy import Enum, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class EquipmentType(str, enum.Enum):
    PANEL = "panel"
    INVERTER = "inverter"
    BATTERY = "battery"
    EV_CHARGER = "ev_charger"


class Equipment(Base):
    __tablename__ = "equipment"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    model_name: Mapped[str] = mapped_column(String(255))
    equipment_type: Mapped[EquipmentType] = mapped_column(Enum(EquipmentType), index=True)
    manufacturer_id: Mapped[int] = mapped_column(Integer, ForeignKey("manufacturers.id"))
    power_rating_w: Mapped[int] = mapped_column(Integer)
    efficiency_percent: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    warranty_years: Mapped[int] = mapped_column(Integer)
    weight_kg: Mapped[Decimal] = mapped_column(Numeric(8, 2))
    dimensions: Mapped[dict] = mapped_column(JSONB)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    certification: Mapped[str] = mapped_column(String(500))
    release_year: Mapped[int] = mapped_column(Integer)
    image_url: Mapped[str | None] = mapped_column(String(500))
    description: Mapped[str] = mapped_column(Text)
    extra_fields: Mapped[dict | None] = mapped_column(JSONB)

    manufacturer = relationship("Manufacturer", back_populates="equipment")
