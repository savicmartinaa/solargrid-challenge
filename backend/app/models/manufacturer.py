from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Manufacturer(Base):
    __tablename__ = "manufacturers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    country: Mapped[str] = mapped_column(String(100))
    city: Mapped[str] = mapped_column(String(100))
    founded_year: Mapped[int] = mapped_column(Integer)
    website: Mapped[str] = mapped_column(String(500))
    logo_url: Mapped[str] = mapped_column(String(500))
    description: Mapped[str] = mapped_column(Text)

    equipment = relationship("Equipment", back_populates="manufacturer")
