import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.review import Review
from app.schemas.inkloom import (
    InkloomGenerateRequest, InkloomAssetResponse, InkloomCreditsResponse
)
from app.schemas.review import EvaluationResultResponse, IssueSchema
from app.ai.inkloom_service import InkloomService
from app.engine.rule_engine import RuleEngine
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/inkloom", tags=["Inkloom AI Integration ($100 Credits)"])

@router.get("/credits", response_model=InkloomCreditsResponse)
def get_inkloom_credits():
    """
    Fetch live status of the $100 early-access promotional credits from Inkloom.art
    """
    return InkloomService.get_credits_status()

@router.post("/generate", response_model=InkloomAssetResponse)
def generate_inkloom_brand_asset(
    payload: InkloomGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate brand assets (vector logo, color palette, marketing copy)
    using Inkloom AI early-access compute credits ($10 deducted per run).
    """
    if not payload.brand_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Brand name is required for Inkloom generation."
        )

    asset = InkloomService.generate_brand_asset(
        brand_name=payload.brand_name.strip(),
        industry=payload.industry,
        style_preference=payload.style_preference,
        prompt_keywords=payload.prompt_keywords
    )
    return asset

@router.post("/submit-to-governance", response_model=EvaluationResultResponse, status_code=status.HTTP_201_CREATED)
def submit_inkloom_to_governance(
    asset_id: str,
    brand_name: str,
    draft_copy: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Directly dispatch an Inkloom-generated asset into the BrandGuard Admin Governance Queue.
    Status is strictly set to 'Pending' until Admin or Manager signs off.
    """
    scan_results = RuleEngine.evaluate(draft_copy)
    review_id = f"ink-rev-{int(datetime.utcnow().timestamp())}"
    title = f"{brand_name} (Inkloom AI Brand Asset & Logo)"

    issues = list(scan_results["issues"])

    new_review = Review(
        id=review_id,
        title=title,
        author=f"{current_user.name} (via Inkloom AI)",
        author_email=current_user.email,
        workspace=current_user.workspace or "CarePlus Health",
        status="Pending", # STRICTLY PENDING UNTIL ADMIN APPROVES
        tone="amber",
        content_type="AI Logo & Brand Identity (Inkloom)",
        version="v1.0 (Inkloom)",
        draft=draft_copy,
        score=scan_results["score"],
        issues_count=len(issues),
        issues_json=json.dumps([issue.model_dump() for issue in issues]),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return EvaluationResultResponse(
        review_id=review_id,
        title=title,
        status="Pending",
        score=scan_results["score"],
        open_issues_count=len(issues),
        issues=issues,
        evaluated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        message=f"Inkloom AI Asset ({asset_id}) submitted to Admin Governance Queue! Status: ⏳ Pending Admin Approval."
    )
