from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories.manufacturer import ManufacturerRepository
from app.schemas.manufacturer import ManufacturerResponse

router = APIRouter()


@router.get("", response_model=list[ManufacturerResponse])
def list_manufacturers(db: Session = Depends(get_db)):
    repo = ManufacturerRepository(db)
    return repo.get_all()
