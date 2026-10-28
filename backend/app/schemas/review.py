from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel

class IssueSchema(BaseModel):
    id: str
    severity: str # 'High', 'Medium', 'Low'
    type: str
    quote: str
    explanation: str
    rewrite: Optional[str] = None
    state: str = "open" # 'open', 'resolved'
    verified: bool = True

class ReviewEvaluateRequest(BaseModel):
    brand_name: str
    draft: str
    custom_rules: Optional[str] = None
    platform: Optional[str] = "Social media copy"
    workspace: Optional[str] = "CarePlus Health"

class ReviewCreate(BaseModel):
    title: str
    draft: str
    platform: Optional[str] = "Social media copy"
    workspace: Optional[str] = "CarePlus Health"

class ReviewSignOffRequest(BaseModel):
    decision: str # 'approve', 'request_changes', 'reject'
    feedback: Optional[str] = None

class ReviewResponse(BaseModel):
    id: str
    title: str
    author: str
    author_email: str
    workspace: str
    status: str # 'Pending', 'Approved', 'Changes requested', 'Rejected', 'Content Approved (Limited)'
    tone: str
    content_type: str
    version: str
    draft: str
    score: int
    issues_count: int
    issues: List[IssueSchema] = []
    risk_level: Optional[str] = "High Risk" # 'High Risk', 'Moderate Risk', 'Normal Risk', 'Safe'
    risk_color: Optional[str] = "#ef4444"
    risk_summary: Optional[str] = None
    route_decision: Optional[str] = "Escalate"
    route_action: Optional[str] = None
    toxicity_score: Optional[str] = "99% Brand Safe"
    sentiment: Optional[str] = "Clinical & Empathetic"
    context_tags: List[str] = []
    requires_human_moderator: bool = True
    approved_by: Optional[str] = None
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EvaluationResultResponse(BaseModel):
    review_id: str
    title: str
    status: str = "Pending"
    score: int
    open_issues_count: int
    issues: List[IssueSchema]
    risk_level: Optional[str] = "High Risk"
    risk_color: Optional[str] = "#ef4444"
    risk_summary: Optional[str] = None
    pipeline_stage: str = "AI Routing (Decision Engine)"
    route_decision: str = "Escalate"
    route_action: Optional[str] = None
    toxicity_score: str = "99% Brand Safe"
    sentiment: str = "Clinical & Empathetic"
    context_tags: List[str] = []
    requires_human_moderator: bool = True
    evaluated_at: str
    message: str
