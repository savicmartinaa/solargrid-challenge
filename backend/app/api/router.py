from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.equipment import router as equipment_router
from app.api.manufacturers import router as manufacturers_router

router = APIRouter(prefix="/api")

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(equipment_router, prefix="/equipment", tags=["equipment"])
router.include_router(manufacturers_router, prefix="/manufacturers", tags=["manufacturers"])
