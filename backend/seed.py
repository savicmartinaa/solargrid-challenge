import argparse
import json
import sys
from pathlib import Path

import bcrypt
from sqlalchemy import text

sys.path.insert(0, str(Path(__file__).parent))

from app.database import SessionLocal
from app.models import Equipment, Manufacturer, User

DEFAULT_SEED_FILE = Path(__file__).parent.parent / "seed-data.json"

EQUIPMENT_BASE_FIELDS = {
    "id", "model_name", "equipment_type", "manufacturer_id",
    "power_rating_w", "efficiency_percent", "warranty_years",
    "weight_kg", "dimensions", "price", "certification",
    "release_year", "image_url", "description",
}


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def seed(seed_file: Path = DEFAULT_SEED_FILE):
    db = SessionLocal()

    try:
        if db.query(Manufacturer).count() > 0:
            print("Database already seeded. Skipping.")
            return

        with open(seed_file) as file:
            data = json.load(file)

        for manufacturer_data in data["manufacturers"]:
            db.add(Manufacturer(**manufacturer_data))

        for equipment_data in data["equipment"]:
            base_fields = {k: v for k, v in equipment_data.items() if k in EQUIPMENT_BASE_FIELDS}
            extra_fields = {k: v for k, v in equipment_data.items() if k not in EQUIPMENT_BASE_FIELDS}
            base_fields["extra_fields"] = extra_fields if extra_fields else None
            db.add(Equipment(**base_fields))

        for user_data in data["users"]:
            db.add(User(
                id=user_data["id"],
                email=user_data["email"],
                name=user_data["name"],
                role=user_data["role"],
                password_hash=hash_password(user_data["password_plain"]),
            ))

        db.commit()

        db.execute(text("SELECT setval('manufacturers_id_seq', (SELECT MAX(id) FROM manufacturers))"))
        db.execute(text("SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment))"))
        db.execute(text("SELECT setval('users_id_seq', (SELECT MAX(id) FROM users))"))
        db.commit()

        print(f"Seeded: {len(data['manufacturers'])} manufacturers, "
              f"{len(data['equipment'])} equipment, {len(data['users'])} users.")

    except Exception as error:
        db.rollback()
        print(f"Error seeding: {error}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed the database")
    parser.add_argument("--file", type=Path, default=DEFAULT_SEED_FILE)
    args = parser.parse_args()
    seed(args.file)
