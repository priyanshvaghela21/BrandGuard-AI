from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime
from app.database import Base

class Review(Base):
    """Marketing Creative Submission & Review Pipeline Model"""
    __tablename__ = "reviews"

    id = Column(String(80), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(120), nullable=False)
    author_email = Column(String(255), index=True, nullable=False)
    workspace = Column(String(100), default="CarePlus Health")
    status = Column(String(50), nullable=False, default="Pending") # 'Pending', 'Approved', 'Changes requested', 'Rejected'
    tone = Column(String(50), default="amber") # 'amber', 'green', 'rose'
    content_type = Column(String(100), default="Social media copy")
    version = Column(String(50), default="v1.0")
    draft = Column(Text, nullable=False)
    score = Column(Integer, default=100)
    issues_count = Column(Integer, default=0)
    issues_json = Column(Text, nullable=True) # JSON representation of detected compliance issues
    route_decision = Column(String(50), default="Escalate") # 'Auto-Resolve', 'Reject', 'Escalate'
    route_action = Column(String(255), nullable=True)
    toxicity_score = Column(String(50), default="99% Brand Safe")
    sentiment = Column(String(100), default="Clinical & Empathetic")
    context_tags_json = Column(Text, nullable=True)
    approved_by = Column(String(120), nullable=True) # Admin or Brand Manager who approved
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
