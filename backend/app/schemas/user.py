from pydantic import BaseModel

from app.models.user import Role


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: Role

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    message: str = "Login successful"
    user: UserResponse
