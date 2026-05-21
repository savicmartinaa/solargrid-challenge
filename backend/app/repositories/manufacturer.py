from sqlalchemy.orm import Session

from app.models.manufacturer import Manufacturer


class ManufacturerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Manufacturer]:
        return self.db.query(Manufacturer).all()

    def get_by_id(self, manufacturer_id: int) -> Manufacturer | None:
        return self.db.query(Manufacturer).filter(Manufacturer.id == manufacturer_id).first()
