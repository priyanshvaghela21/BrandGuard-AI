import json
import logging
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models.user import User, LoginSession
from app.models.rule import Rule
from app.models.review import Review
from app.models.audit import AuditLog
from app.auth.security import hash_password
from app.routers import auth_router, review_router, rule_router, audit_router, inkloom_router

logger = logging.getLogger("brandguard.app")
logging.basicConfig(level=logging.INFO)

# ── 1. Create FastAPI Application ──
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Autonomous Brand Review & Governance Platform API - FastAPI + PostgreSQL + Google Gemini + SQLAlchemy + Pydantic + JWT",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# ── 2. Configure CORS Middleware ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In development, allow frontend Vite on any local port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 3. Register Routers ──
app.include_router(auth_router)
app.include_router(review_router)
app.include_router(rule_router)
app.include_router(audit_router)
app.include_router(inkloom_router)

# ── 4. Health Check Endpoint ──
@app.get("/api/health", tags=["System Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "BrandGuard Governance Backend",
        "version": settings.VERSION,
        "database": "connected",
        "timestamp": datetime.utcnow().isoformat()
    }

# ── 5. Serve Frontend Production Build (Unified Single URL) ──
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist"))
if os.path.exists(DIST_DIR):
    assets_dir = os.path.join(DIST_DIR, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    def serve_frontend_spa(full_path: str):
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path.startswith("openapi.json"):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not Found")

        file_path = os.path.join(DIST_DIR, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)

        index_file = os.path.join(DIST_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "BrandGuard Frontend build not found. Run 'npm run build'."}

# ── 5. Database Initialization & Seeding ──
@app.on_event("startup")
def startup_event():
    """Create database schema and seed initial users, rules, and review queue."""
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")

    db = SessionLocal()
    try:
        # 1. Seed Users (Admin, Manager, Creator)
        seed_users = [
            {
                "name": "Sanskruti Antala",
                "email": "admin@brandguard.ai",
                "password": "admin123",
                "role": "admin",
                "role_label": "Super Admin (Full Governance)",
                "organization": "Inkloom Brand Governance HQ",
                "workspace": "CarePlus Health"
            },
            {
                "name": "Aarav Mehta",
                "email": "manager@brandguard.ai",
                "password": "manager123",
                "role": "manager",
                "role_label": "Brand Manager (Review & Sign-Off)",
                "organization": "CarePlus Governance Board",
                "workspace": "CarePlus Health"
            },
            {
                "name": "Priyansh Vaghela",
                "email": "creator@brandguard.ai",
                "password": "creator123",
                "role": "creator",
                "role_label": "Content Creator",
                "organization": "Noble University / Creator Hub",
                "workspace": "CarePlus Health"
            },
            {
                "name": "Priyansh Vaghela",
                "email": "client@brandguard.ai",
                "password": "client123",
                "role": "creator",
                "role_label": "Content Creator",
                "organization": "Noble University / Creator Hub",
                "workspace": "CarePlus Health"
            }
        ]

        for u_data in seed_users:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if not existing:
                user = User(
                    name=u_data["name"],
                    email=u_data["email"],
                    hashed_password=hash_password(u_data["password"]),
                    role=u_data["role"],
                    role_label=u_data["role_label"],
                    organization=u_data["organization"],
                    workspace=u_data["workspace"],
                    is_active=True
                )
                db.add(user)
                logger.info("Seeded user: %s (%s)", u_data["email"], u_data["role"])

        # 2. Seed Default Brand Rules (R1 - R4)
        seed_rules = [
            {
                "id": "R1",
                "title": "Absolute Medical Guarantees & Cure Claims",
                "category": "Legal & Claims",
                "severity": "High",
                "description": "Prohibits unqualified guarantees ('100% cure', 'permanently cures', 'miraculous results') without regulatory clinical evidence.",
                "banned_patterns": json.dumps(["guarantees 100%", "permanently cures", "miraculous treatment", "overnight cure"]),
                "approved_facts": json.dumps(["clinically proven relief in eligible cohorts", "verified care pathways"]),
                "is_active": True,
                "trigger_count": 42
            },
            {
                "id": "R2",
                "title": "Patient-Centric Nomenclature",
                "category": "Terminology",
                "severity": "Low",
                "description": "Mandates referring to individuals as 'customer', 'patient', or 'member' instead of technical jargon 'user'.",
                "banned_patterns": json.dumps(["user", "users", "end-user"]),
                "approved_facts": json.dumps(["customer", "patient", "member"]),
                "is_active": True,
                "trigger_count": 26
            },
            {
                "id": "R3",
                "title": "CIELAB Color Delta-E & WCAG AA Contrast",
                "category": "Visual & Palette",
                "severity": "Medium",
                "description": "Enforces brand palette (#001F3F Navy, #0E7C86 Teal). Flags contrast < 4.5:1.",
                "banned_patterns": json.dumps(["#9851E0", "neon purple", "electric pink"]),
                "approved_facts": json.dumps(["#001F3F (Deep Navy)", "#0E7C86 (Ocean Teal)", "#FFFFFF (Crisp White)"]),
                "is_active": True,
                "trigger_count": 19
            },
            {
                "id": "R4",
                "title": "Zero Fees & Free Treatment Asterisk Disclaimer",
                "category": "Compliance & Pricing",
                "severity": "High",
                "description": "Any claim mentioning 'zero fees' or 'free treatment' must include an asterisk (*) referencing eligibility conditions.",
                "banned_patterns": json.dumps(["zero fees without asterisk", "free treatment without conditions"]),
                "approved_facts": json.dumps(["zero out-of-pocket consultation fees on eligible plans*"]),
                "is_active": True,
                "trigger_count": 13
            }
        ]

        for r_data in seed_rules:
            existing_rule = db.query(Rule).filter(Rule.id == r_data["id"]).first()
            if not existing_rule:
                rule = Rule(**r_data)
                db.add(rule)
                logger.info("Seeded rule: %s (%s)", r_data["id"], r_data["title"])

        # 3. Seed Initial Review Queue Submissions (Notice status='Pending' for Creator's submission)
        seed_reviews = [
            {
                "id": "review-1",
                "title": "CarePlus Diwali campaign",
                "author": "Priyansh Vaghela",
                "author_email": "creator@brandguard.ai",
                "workspace": "CarePlus Health",
                "status": "Pending", # Strictly Pending as requested!
                "tone": "amber",
                "content_type": "Social media banner & copy",
                "version": "v3.2",
                "draft": "Meet the future of healthcare with CarePlus. Our app guarantees 100% results for every user, so you can spend less time worrying and more time living.\n\nJoin millions of user this Diwali and discover care that puts you first. Download today.",
                "score": 60,
                "issues_count": 2,
                "issues_json": json.dumps([
                    {
                        "id": "R1",
                        "severity": "High",
                        "type": "Unsupported medical guarantee",
                        "quote": "guarantees 100% results for every user",
                        "explanation": "Absolute guarantees need clinical substantiation.",
                        "rewrite": "delivers verified, comprehensive support for your health journey",
                        "state": "open",
                        "verified": True
                    },
                    {
                        "id": "R2",
                        "severity": "Low",
                        "type": "Terminology nomenclature",
                        "quote": "user",
                        "explanation": "Use approved term 'customer' or 'patient'.",
                        "rewrite": "customer",
                        "state": "open",
                        "verified": True
                    }
                ])
            },
            {
                "id": "review-2",
                "title": "Q4 product announcement",
                "author": "Nisha Shah",
                "author_email": "nisha@agency.com",
                "workspace": "CarePlus Health",
                "status": "Changes requested",
                "tone": "rose",
                "content_type": "Email newsletter",
                "version": "v1.1",
                "draft": "Exclusive health packages with flat 70% OFF this quarter.",
                "score": 75,
                "issues_count": 1,
                "issues_json": json.dumps([])
            },
            {
                "id": "review-3",
                "title": "Customer success email",
                "author": "Rohan Patel",
                "author_email": "rohan@freelance.org",
                "workspace": "CarePlus Health",
                "status": "Approved",
                "tone": "green",
                "content_type": "Email sequence",
                "version": "v2.0",
                "draft": "Hear from verified patients about their healthcare experience.",
                "score": 100,
                "issues_count": 0,
                "approved_by": "Sanskruti Antala (Super Admin)",
                "approved_at": datetime.utcnow(),
                "issues_json": json.dumps([])
            }
        ]

        for rev_data in seed_reviews:
            existing_rev = db.query(Review).filter(Review.id == rev_data["id"]).first()
            if not existing_rev:
                rev = Review(**rev_data)
                db.add(rev)
                logger.info("Seeded review item: %s (%s)", rev_data["id"], rev_data["status"])

        # 4. Seed Initial Audit History Log
        existing_audit = db.query(AuditLog).filter(AuditLog.audit_id == "AUD-8349").first()
        if not existing_audit:
            audit = AuditLog(
                audit_id="AUD-8349",
                title="Customer success email",
                author="Rohan Patel (Creator)",
                approver="Sanskruti Antala (Super Admin)",
                status="Approved",
                score=100,
                issues_fixed=2,
                original_text="Hear from patients about their healthcare journey with CarePlus.",
                approved_text="Hear from patients about their healthcare journey with CarePlus.",
                certificate_seal="SHA256-CERT-B9482F",
                created_at=datetime.utcnow()
            )
            db.add(audit)
            logger.info("Seeded initial audit history record.")

        db.commit()
    except Exception as exc:
        logger.error("Startup seeding encountered error: %s", exc)
        db.rollback()
    finally:
        db.close()
