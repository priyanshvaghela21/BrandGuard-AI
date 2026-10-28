from typing import List, Optional
from pydantic import BaseModel

class RuleBase(BaseModel):
    id: str
    title: str
    category: str
    severity: str
    description: str
    banned_patterns: List[str]
    approved_facts: Optional[List[str]] = []
    is_active: bool = True

class RuleCreate(RuleBase):
    pass

class RuleUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    severity: Optional[str] = None
    description: Optional[str] = None
    banned_patterns: Optional[List[str]] = None
    approved_facts: Optional[List[str]] = None
    is_active: Optional[bool] = None

class RuleResponse(RuleBase):
    trigger_count: int

    class Config:
        from_attributes = True
