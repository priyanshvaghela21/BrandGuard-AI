from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AuditLogResponse(BaseModel):
    id: int
    audit_id: str
    title: str
    author: str
    approver: str
    status: str
    score: int
    issues_fixed: int
    original_text: str
    approved_text: str
    certificate_seal: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
