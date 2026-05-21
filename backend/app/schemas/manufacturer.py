from pydantic import BaseModel


class ManufacturerBrief(BaseModel):
    id: int
    name: str
    logo_url: str

    class Config:
        from_attributes = True


class ManufacturerResponse(BaseModel):
    id: int
    name: str
    slug: str
    country: str
    city: str
    founded_year: int
    website: str
    logo_url: str
    description: str

    class Config:
        from_attributes = True
