from datetime import datetime
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime
from app.database import Base

class Rule(Base):
    """Brand Governance Rule Model"""
    __tablename__ = "rules"

    id = Column(String(50), primary_key=True, index=True) # e.g. 'R1', 'R2'
    title = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False) # 'Legal & Claims', 'Terminology', 'Brand Tone'
    severity = Column(String(50), nullable=False, default="High") # 'High', 'Medium', 'Low'
    description = Column(Text, nullable=False)
    banned_patterns = Column(Text, nullable=False) # JSON encoded or comma-separated patterns
    approved_facts = Column(Text, nullable=True) # JSON encoded or comma-separated facts
    is_active = Column(Boolean, default=True)
    trigger_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
