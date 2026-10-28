from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: str
    role: str # 'admin', 'manager', 'creator'
    role_label: Optional[str] = None
    organization: Optional[str] = "Inkloom Brand Governance HQ"
    workspace: Optional[str] = "CarePlus Health"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
    turnstile_verified: Optional[bool] = True

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class SessionResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    portal_type: str
    organization: str
    workspace: str
    auth_method: str
    sso_provider: Optional[str] = None
    ip_address: str
    location: str
    device: str
    status: str
    security_score: str
    login_time: datetime

    class Config:
        from_attributes = True
