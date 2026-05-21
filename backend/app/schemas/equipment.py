from decimal import Decimal

from pydantic import BaseModel

from app.models.equipment import EquipmentType
from app.schemas.manufacturer import ManufacturerBrief, ManufacturerResponse


class EquipmentFilter(BaseModel):
    type: EquipmentType | None = None
    manufacturer_id: int | None = None
    search: str | None = None


class EquipmentDimensions(BaseModel):
    w: int
    h: int
    d: int


class EquipmentListItem(BaseModel):
    id: int
    model_name: str
    equipment_type: EquipmentType
    power_rating_w: int
    efficiency_percent: Decimal
    warranty_years: int
    weight_kg: Decimal
    dimensions: EquipmentDimensions
    price: Decimal
    certification: str
    release_year: int
    image_url: str | None
    description: str
    extra_fields: dict | None
    manufacturer: ManufacturerBrief

    class Config:
        from_attributes = True


class EquipmentDetail(BaseModel):
    id: int
    model_name: str
    equipment_type: EquipmentType
    manufacturer_id: int
    power_rating_w: int
    efficiency_percent: Decimal
    warranty_years: int
    weight_kg: Decimal
    dimensions: EquipmentDimensions
    price: Decimal
    certification: str
    release_year: int
    image_url: str | None
    description: str
    extra_fields: dict | None
    manufacturer: ManufacturerResponse

    class Config:
        from_attributes = True


class EquipmentCreate(BaseModel):
    model_name: str
    equipment_type: EquipmentType
    manufacturer_id: int
    power_rating_w: int
    efficiency_percent: Decimal
    warranty_years: int
    weight_kg: Decimal
    dimensions: EquipmentDimensions
    price: Decimal
    certification: str
    release_year: int
    image_url: str | None = None
    description: str
    extra_fields: dict | None = None


class EquipmentUpdate(BaseModel):
    model_name: str | None = None
    equipment_type: EquipmentType | None = None
    manufacturer_id: int | None = None
    power_rating_w: int | None = None
    efficiency_percent: Decimal | None = None
    warranty_years: int | None = None
    weight_kg: Decimal | None = None
    dimensions: EquipmentDimensions | None = None
    price: Decimal | None = None
    certification: str | None = None
    release_year: int | None = None
    image_url: str | None = None
    description: str | None = None
    extra_fields: dict | None = None
