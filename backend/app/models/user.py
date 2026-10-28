from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="creator") # 'admin', 'manager', 'creator'
    role_label = Column(String(120), nullable=False)
    organization = Column(String(150), default="Inkloom Brand Governance HQ")
    workspace = Column(String(100), default="CarePlus Health")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class LoginSession(Base):
    """Real-time User Login Activity & Access Telemetry Model for Admin Portal"""
    __tablename__ = "login_sessions"

    id = Column(String(50), primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), index=True, nullable=False)
    role = Column(String(120), nullable=False)
    portal_type = Column(String(50), nullable=False) # 'admin', 'manager', 'client'
    organization = Column(String(150), nullable=False)
    workspace = Column(String(100), nullable=False)
    auth_method = Column(String(80), default="Email & Password")
    sso_provider = Column(String(50), nullable=True)
    ip_address = Column(String(50), nullable=False)
    location = Column(String(150), default="Ahmedabad, Gujarat, IN")
    device = Column(String(120), default="Chrome • Windows 11")
    status = Column(String(50), default="Online") # 'Online', 'Revoked', 'Logged Out'
    security_score = Column(String(50), default="100% Verified")
    login_time = Column(DateTime, default=datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.utcnow)
