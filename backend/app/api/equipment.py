from pathlib import Path
from shutil import copyfileobj
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_role
from app.models.user import User
from app.repositories.equipment import EquipmentRepository
from app.repositories.manufacturer import ManufacturerRepository
from app.schemas.equipment import (
    EquipmentCreate,
    EquipmentDetail,
    EquipmentFilter,
    EquipmentListItem,
    EquipmentUpdate,
)

router = APIRouter()

UPLOAD_DIR = Path("uploads/equipment")
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}


@router.get("", response_model=list[EquipmentListItem])
def list_equipment(
    filters: EquipmentFilter = Depends(),
    db: Session = Depends(get_db),
):
    repo = EquipmentRepository(db)
    return repo.get_all(filters)


@router.get("/{equipment_id}", response_model=EquipmentDetail)
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    repo = EquipmentRepository(db)
    equipment = repo.get_by_id(equipment_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found",
        )
    return equipment


@router.post("", response_model=EquipmentDetail, status_code=status.HTTP_201_CREATED)
def create_equipment(
    body: EquipmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "editor")),
):
    manufacturer_repo = ManufacturerRepository(db)
    if not manufacturer_repo.get_by_id(body.manufacturer_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Manufacturer not found",
        )

    repo = EquipmentRepository(db)
    return repo.create(body.model_dump())


@router.post("/upload-image")
def upload_equipment_image(
    image: UploadFile = File(...),
    current_user: User = Depends(require_role("admin", "editor")),
):
    extension = ALLOWED_IMAGE_TYPES.get(image.content_type or "")
    if not extension:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG, WebP, and SVG images are supported",
        )

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    with file_path.open("wb") as buffer:
        copyfileobj(image.file, buffer)

    return {"image_url": f"/uploads/equipment/{filename}"}


@router.put("/{equipment_id}", response_model=EquipmentDetail)
def update_equipment(
    equipment_id: int,
    body: EquipmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "editor")),
):
    repo = EquipmentRepository(db)
    equipment = repo.get_by_id(equipment_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found",
        )

    update_data = body.model_dump(exclude_unset=True)

    if "manufacturer_id" in update_data:
        manufacturer_repo = ManufacturerRepository(db)
        if not manufacturer_repo.get_by_id(update_data["manufacturer_id"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Manufacturer not found",
            )

    return repo.update(equipment, update_data)


@router.delete("/{equipment_id}")
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    repo = EquipmentRepository(db)
    equipment = repo.get_by_id(equipment_id)
    if not equipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Equipment not found",
        )

    repo.delete(equipment)
    return {"message": f"Equipment '{equipment.model_name}' deleted"}
