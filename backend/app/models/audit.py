from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class AuditLog(Base):
    """Cryptographic Compliance & Governance Audit Trail Model"""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    audit_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. 'AUD-8349'
    title = Column(String(255), nullable=False)
    author = Column(String(150), nullable=False)
    approver = Column(String(150), nullable=False)
    status = Column(String(50), default="Approved")
    score = Column(Integer, default=100)
    issues_fixed = Column(Integer, default=0)
    original_text = Column(Text, nullable=False)
    approved_text = Column(Text, nullable=False)
    certificate_seal = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
