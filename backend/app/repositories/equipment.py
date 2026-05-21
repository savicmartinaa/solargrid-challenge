from sqlalchemy.orm import Session, contains_eager, joinedload

from app.models.equipment import Equipment
from app.models.manufacturer import Manufacturer
from app.schemas.equipment import EquipmentFilter


class EquipmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, filters: EquipmentFilter) -> list[Equipment]:
        query = self.db.query(Equipment)

        if filters.search:
            search_term = f"%{filters.search}%"
            query = query.join(Manufacturer).options(
                contains_eager(Equipment.manufacturer)
            ).filter(
                (Equipment.model_name.ilike(search_term))
                | (Manufacturer.name.ilike(search_term))
            )
        else:
            query = query.options(joinedload(Equipment.manufacturer))

        if filters.type:
            query = query.filter(Equipment.equipment_type == filters.type)
        if filters.manufacturer_id:
            query = query.filter(Equipment.manufacturer_id == filters.manufacturer_id)

        return query.order_by(Equipment.id.asc()).all()

    def get_by_id(self, equipment_id: int) -> Equipment | None:
        return (
            self.db.query(Equipment)
            .options(joinedload(Equipment.manufacturer))
            .filter(Equipment.id == equipment_id)
            .first()
        )

    def create(self, data: dict) -> Equipment:
        equipment = Equipment(**data)
        self.db.add(equipment)
        self.db.commit()
        self.db.refresh(equipment)
        return equipment

    def update(self, equipment: Equipment, data: dict) -> Equipment:
        for field, value in data.items():
            setattr(equipment, field, value)
        self.db.commit()
        self.db.refresh(equipment)
        return equipment

    def delete(self, equipment: Equipment) -> None:
        self.db.delete(equipment)
        self.db.commit()
