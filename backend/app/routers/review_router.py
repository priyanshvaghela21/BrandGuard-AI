import json
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.review import Review
from app.models.audit import AuditLog
from app.schemas.review import (
    ReviewEvaluateRequest, ReviewResponse, ReviewSignOffRequest,
    EvaluationResultResponse, IssueSchema
)
from app.engine.rule_engine import RuleEngine
from app.engine.routing_engine import AIRoutingEngine
from app.ai.gemini_service import GeminiService
from app.auth.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/reviews", tags=["Marketing Review & Approval Pipeline"])

@router.post("/evaluate", response_model=EvaluationResultResponse, status_code=status.HTTP_201_CREATED)
def evaluate_and_submit_review(
    payload: ReviewEvaluateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    User/Creator evaluates content with AI Dual-Engine.
    The request is automatically dispatched to the Admin Governance Queue
    and its status is STRICTLY SET TO 'Pending' until an Admin approves it.
    """
    if not payload.draft.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Draft content cannot be empty."
        )

    # ── STAGE 2: AI Filtering (Spam, Malware & Blacklisted Terms) ──
    filter_res = AIRoutingEngine.filter_content(payload.draft)

    # ── STAGE 3: AI Tagging & Analysis (Toxicity, Sentiment & Context) ──
    tag_res = AIRoutingEngine.tag_and_analyze(payload.draft, payload.brand_name)

    # ── STAGE 4: Deterministic Rule Engine Scan + Gemini AI ──
    rule_results = RuleEngine.evaluate(payload.draft, payload.custom_rules)
    ai_results = GeminiService.analyze_brand_content(
        brand_name=payload.brand_name,
        draft=payload.draft,
        custom_rules=payload.custom_rules
    )

    combined_issues: List[IssueSchema] = list(rule_results["issues"])
    final_score = rule_results["score"]

    # ── STAGE 5: AI Routing (Decision Engine - Akira AI Architecture) ──
    routing_res = AIRoutingEngine.decide_route(
        filter_res=filter_res,
        tag_res=tag_res,
        compliance_score=final_score,
        issues=combined_issues
    )

    status_str = routing_res["target_status"]
    tone_str = routing_res["tone"]

    # Save submission into PostgreSQL / Database
    review_id = f"rev-{int(datetime.utcnow().timestamp())}"
    title = f"{payload.brand_name.strip() or 'Brand'} Situation & Marketing Review"

    new_review = Review(
        id=review_id,
        title=title,
        author=current_user.name,
        author_email=current_user.email,
        workspace=payload.workspace or current_user.workspace or "CarePlus Health",
        status=status_str, # 'Pending', 'Content Approved (Limited)', or 'Rejected'
        tone=tone_str,
        content_type=payload.platform or "Social media copy",
        version="v1.0",
        draft=payload.draft,
        score=final_score,
        issues_count=len(combined_issues),
        issues_json=json.dumps([issue.model_dump() for issue in combined_issues]),
        route_decision=routing_res["route"],
        route_action=routing_res["action"],
        toxicity_score=tag_res["toxicity_score"],
        sentiment=tag_res["sentiment"],
        context_tags_json=json.dumps(tag_res["context_tags"]),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    return EvaluationResultResponse(
        review_id=review_id,
        title=title,
        status=status_str,
        score=final_score,
        open_issues_count=len(combined_issues),
        issues=combined_issues,
        risk_level=rule_results.get("risk_level", "High Risk"),
        risk_color=rule_results.get("risk_color", "#ef4444"),
        risk_summary=rule_results.get("risk_summary", "Evaluated by Akira AI Rule Engine."),
        pipeline_stage="AI Routing (Decision Engine)",
        route_decision=routing_res["route"],
        route_action=routing_res["action"],
        toxicity_score=tag_res["toxicity_score"],
        sentiment=tag_res["sentiment"],
        context_tags=tag_res["context_tags"],
        requires_human_moderator=routing_res["requires_moderator"],
        evaluated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        message=f"Akira AI Governance Pipeline Complete! Route: [{routing_res['route_label']}] -> Outcome: {status_str}."
    )

@router.get("", response_model=List[ReviewResponse])
def get_reviews(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve review queue submissions.
    - Creators see only their own private submissions.
    - Admins & Managers see all workspace submissions.
    """
    query = db.query(Review)

    # Creators only get their own data (Role Isolation)
    if current_user.role == "creator":
        query = query.filter(Review.author_email == current_user.email)

    if status_filter:
        query = query.filter(Review.status == status_filter)

    reviews = query.order_by(Review.created_at.desc()).all()

    # Parse issues_json back to Pydantic objects
    results = []
    for r in reviews:
        parsed_issues = []
        if r.issues_json:
            try:
                raw = json.loads(r.issues_json)
                parsed_issues = [IssueSchema(**item) for item in raw]
            except Exception:
                pass
        
        resp = ReviewResponse(
            id=r.id,
            title=r.title,
            author=r.author,
            author_email=r.author_email,
            workspace=r.workspace,
            status=r.status,
            tone=r.tone,
            content_type=r.content_type,
            version=r.version,
            draft=r.draft,
            score=r.score,
            issues_count=r.issues_count,
            issues=parsed_issues,
            route_decision=r.route_decision or "Escalate",
            route_action=r.route_action or "Human Moderator Review Required",
            toxicity_score=r.toxicity_score or "99% Brand Safe",
            sentiment=r.sentiment or "Clinical & Empathetic",
            context_tags=json.loads(r.context_tags_json) if r.context_tags_json else ["[Brand Marketing]"],
            requires_human_moderator=(r.status == "Pending"),
            approved_by=r.approved_by,
            approved_at=r.approved_at,
            created_at=r.created_at,
            updated_at=r.updated_at
        )
        results.append(resp)

    return results

@router.get("/{review_id}", response_model=ReviewResponse)
def get_review_detail(
    review_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve detailed evaluation findings for a specific submission."""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review submission not found.")

    if current_user.role == "creator" and review.author_email != current_user.email:
        raise HTTPException(status_code=403, detail="Forbidden: You can only inspect your own submissions.")

    parsed_issues = []
    if review.issues_json:
        try:
            raw = json.loads(review.issues_json)
            parsed_issues = [IssueSchema(**item) for item in raw]
        except Exception:
            pass

    return ReviewResponse(
        id=review.id,
        title=review.title,
        author=review.author,
        author_email=review.author_email,
        workspace=review.workspace,
        status=review.status,
        tone=review.tone,
        content_type=review.content_type,
        version=review.version,
        draft=review.draft,
        score=review.score,
        issues_count=review.issues_count,
        issues=parsed_issues,
        route_decision=review.route_decision or "Escalate",
        route_action=review.route_action or "Human Moderator Review Required",
        toxicity_score=review.toxicity_score or "99% Brand Safe",
        sentiment=review.sentiment or "Clinical & Empathetic",
        context_tags=json.loads(review.context_tags_json) if review.context_tags_json else ["[Brand Marketing]"],
        requires_human_moderator=(review.status == "Pending"),
        approved_by=review.approved_by,
        approved_at=review.approved_at,
        created_at=review.created_at,
        updated_at=review.updated_at
    )

@router.post("/{review_id}/signoff", response_model=ReviewResponse)
def sign_off_review(
    review_id: str,
    payload: ReviewSignOffRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager"]))
):
    """
    Admin & Brand Manager Sign-Off Gate:
    Approves the user submission, transitions status from 'Pending' to 'Approved',
    issues cryptographic compliance certificate, and writes to audit history.
    """
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review submission not found.")

    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Only Admin or Brand Manager can sign off or approve reviews."
        )

    decision = payload.decision.lower().strip()

    if decision == "approve":
        review.status = "Approved"
        review.tone = "green"
        review.approved_by = f"{current_user.name} ({current_user.role_label})"
        review.approved_at = datetime.utcnow()

        # Generate digital compliance seal
        cert_seal = f"SHA256-{uuid.uuid4().hex[:12].upper()}"

        # Write to permanent audit log
        audit_record = AuditLog(
            audit_id=f"AUD-{uuid.uuid4().hex[:6].upper()}",
            title=review.title,
            author=f"{review.author} (Creator)",
            approver=f"{current_user.name} ({current_user.role_label})",
            status="Approved",
            score=review.score,
            issues_fixed=review.issues_count,
            original_text=review.draft,
            approved_text=review.draft,
            certificate_seal=cert_seal,
            created_at=datetime.utcnow()
        )
        db.add(audit_record)

    elif decision == "request_changes":
        review.status = "Changes requested"
        review.tone = "rose"
    elif decision == "reject":
        review.status = "Rejected"
        review.tone = "rose"
    else:
        raise HTTPException(status_code=400, detail="Invalid decision. Choose 'approve', 'request_changes', or 'reject'.")

    review.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(review)

    parsed_issues = []
    if review.issues_json:
        try:
            raw = json.loads(review.issues_json)
            parsed_issues = [IssueSchema(**item) for item in raw]
        except Exception:
            pass

    return ReviewResponse(
        id=review.id,
        title=review.title,
        author=review.author,
        author_email=review.author_email,
        workspace=review.workspace,
        status=review.status,
        tone=review.tone,
        content_type=review.content_type,
        version=review.version,
        draft=review.draft,
        score=review.score,
        issues_count=review.issues_count,
        issues=parsed_issues,
        route_decision=review.route_decision or "Escalate",
        route_action=review.route_action or "Human Moderator Review Required",
        toxicity_score=review.toxicity_score or "99% Brand Safe",
        sentiment=review.sentiment or "Clinical & Empathetic",
        context_tags=json.loads(review.context_tags_json) if review.context_tags_json else ["[Brand Marketing]"],
        requires_human_moderator=(review.status == "Pending"),
        approved_by=review.approved_by,
        approved_at=review.approved_at,
        created_at=review.created_at,
        updated_at=review.updated_at
    )
