import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.rule import Rule
from app.schemas.rule import RuleCreate, RuleResponse, RuleUpdate
from app.auth.dependencies import get_current_user, require_role

router = APIRouter(prefix="/api/rules", tags=["Brand Governance Rulebook"])

@router.get("", response_model=List[RuleResponse])
def get_all_rules(db: Session = Depends(get_db)):
    """Retrieve all brand governance rules."""
    rules = db.query(Rule).all()
    results = []
    for r in rules:
        banned = []
        approved = []
        try:
            banned = json.loads(r.banned_patterns) if r.banned_patterns else []
        except Exception:
            banned = [p.strip() for p in r.banned_patterns.split(",") if p.strip()]

        try:
            approved = json.loads(r.approved_facts) if r.approved_facts else []
        except Exception:
            approved = [f.strip() for f in r.approved_facts.split(",") if f.strip()]

        results.append(
            RuleResponse(
                id=r.id,
                title=r.title,
                category=r.category,
                severity=r.severity,
                description=r.description,
                banned_patterns=banned,
                approved_facts=approved,
                is_active=r.is_active,
                trigger_count=r.trigger_count
            )
        )
    return results

@router.post("", response_model=RuleResponse, status_code=status.HTTP_201_CREATED)
def create_rule(
    payload: RuleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager"]))
):
    """Admin / Manager only: Create a new brand governance rule."""
    existing = db.query(Rule).filter(Rule.id == payload.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Rule with ID {payload.id} already exists.")

    new_rule = Rule(
        id=payload.id,
        title=payload.title,
        category=payload.category,
        severity=payload.severity,
        description=payload.description,
        banned_patterns=json.dumps(payload.banned_patterns),
        approved_facts=json.dumps(payload.approved_facts or []),
        is_active=payload.is_active,
        trigger_count=0
    )
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)

    return RuleResponse(
        id=new_rule.id,
        title=new_rule.title,
        category=new_rule.category,
        severity=new_rule.severity,
        description=new_rule.description,
        banned_patterns=payload.banned_patterns,
        approved_facts=payload.approved_facts or [],
        is_active=new_rule.is_active,
        trigger_count=0
    )

@router.patch("/{rule_id}", response_model=RuleResponse)
def update_rule(
    rule_id: str,
    payload: RuleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["admin", "manager"]))
):
    """Admin / Manager only: Toggle or update a rule."""
    rule = db.query(Rule).filter(Rule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found.")

    if payload.title is not None:
        rule.title = payload.title
    if payload.category is not None:
        rule.category = payload.category
    if payload.severity is not None:
        rule.severity = payload.severity
    if payload.description is not None:
        rule.description = payload.description
    if payload.banned_patterns is not None:
        rule.banned_patterns = json.dumps(payload.banned_patterns)
    if payload.approved_facts is not None:
        rule.approved_facts = json.dumps(payload.approved_facts)
    if payload.is_active is not None:
        rule.is_active = payload.is_active

    db.commit()
    db.refresh(rule)

    banned = []
    approved = []
    try:
        banned = json.loads(rule.banned_patterns) if rule.banned_patterns else []
    except Exception:
        pass
    try:
        approved = json.loads(rule.approved_facts) if rule.approved_facts else []
    except Exception:
        pass

    return RuleResponse(
        id=rule.id,
        title=rule.title,
        category=rule.category,
        severity=rule.severity,
        description=rule.description,
        banned_patterns=banned,
        approved_facts=approved,
        is_active=rule.is_active,
        trigger_count=rule.trigger_count
    )
