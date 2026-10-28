# BrandGuard Autonomous Brand Review & Governance — FastAPI Backend

BrandGuard is an autonomous AI-driven corporate brand governance and advertising compliance platform. This backend implements the complete architecture requested:

## 🏗️ Architecture & Technology Stack

| Component | Technology | Kaam kya hoga? |
|---|---|---|
| **Backend Framework** | **FastAPI** | Frontend aur backend ko connect karna, high-performance async REST API endpoints with Swagger UI documentation |
| **Programming Language** | **Python 3.14 (3.10+)** | Backend logic, rule processing aur AI orchestration |
| **Database** | **PostgreSQL** *(with auto SQLite fallback)* | Users, brand rules, submissions, review queue aur audit history store karna |
| **AI Integration** | **Google Gemini API** | Brand tone check, unsupported claims identify aur compliant smart rewrites suggest karna |
| **Data Validation** | **Pydantic (v2)** | Request validation, type safety, aur AI output structure enforce karna |
| **Authentication** | **JWT (RFC 7519)** | Login sessions, access tokens aur Role-Based Access Control (`admin`, `manager`, `creator`) |
| **Rule Engine** | **Python + Regex** | Banned words, excessive discounts, required disclaimers (*) aur approved terminology check karna |
| **Database Access** | **SQLAlchemy (2.0)** | Python backend se PostgreSQL connect karna, ORM models aur database migrations |

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                   # FastAPI app instance, CORS middleware, startup seeding
│   ├── config.py                 # Pydantic environment configuration (.env)
│   ├── database.py               # SQLAlchemy engine, session maker & connection fallback
│   ├── models/                   # SQLAlchemy ORM Database Models
│   │   ├── __init__.py
│   │   ├── user.py               # User identity & LoginSession access telemetry
│   │   ├── rule.py               # Brand governance rules & guidelines
│   │   ├── review.py             # Marketing creative review submissions
│   │   └── audit.py              # Cryptographic audit history records
│   ├── schemas/                  # Pydantic v2 Request & Response Validation Schemas
│   │   ├── __init__.py
│   │   ├── user.py               # UserCreate, UserLogin, TokenResponse, SessionResponse
│   │   ├── rule.py               # RuleCreate, RuleResponse, RuleUpdate
│   │   ├── review.py             # ReviewEvaluateRequest, ReviewResponse, ReviewSignOffRequest
│   │   └── audit.py              # AuditLogResponse
│   ├── auth/                     # Authentication & Security
│   │   ├── __init__.py
│   │   ├── security.py           # PBKDF2 password hashing & HMAC-SHA256 JWT tokens
│   │   └── dependencies.py       # get_current_user & require_role(['admin', 'manager', 'creator'])
│   ├── engine/                   # Rule Engine
│   │   ├── __init__.py
│   │   └── rule_engine.py        # Python + Regex scanner for banned claims, terminology & disclaimers
│   ├── ai/                       # Google Gemini API Service
│   │   ├── __init__.py
│   │   └── gemini_service.py     # Gemini tone evaluation, claim verification & smart rewrites
│   └── routers/                  # API Endpoints
│       ├── __init__.py
│       ├── auth_router.py        # /api/auth (login, register, me, sessions, revoke)
│       ├── review_router.py      # /api/reviews (evaluate, queue, inspect, signoff/approve, reject)
│       ├── rule_router.py        # /api/rules (list, create, update, toggle)
│       └── audit_router.py       # /api/audit (list history, export CSV)
├── requirements.txt              # Production dependencies
├── .env.example                  # Environment configuration template
├── run.py                        # Server runner script
└── README.md
```

---

## 🚀 How to Run the Backend

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brandguard_db
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET_KEY=brandguard-autonomous-governance-secret-key-2026
```
*(Note: Agar local system par PostgreSQL server run nahi ho raha hai, toh backend automatically SQLite fallback use karega taaki bina kisi rukawat ke backend turant start ho sake).*

### 3. Start the Server
```bash
python run.py
```
Ya direct uvicorn se:
```bash
uvicorn app.main:app --reload --port 8000
```

- **API Base URL:** `http://127.0.0.1:8000`
- **Interactive Swagger Documentation:** `http://127.0.0.1:8000/docs`
- **Alternative ReDoc UI:** `http://127.0.0.1:8000/redoc`

---

## 🔑 Default Seeded Accounts & Credentials

Upon startup, the database automatically seeds the 3 required roles:

1. **👑 Super Admin:**
   - **Email:** `admin@brandguard.ai`
   - **Password:** `admin123`
   - **Capabilities:** Full system governance, real-time user login telemetry, session revocation, master review sign-offs.

2. **🛡️ Brand Manager:**
   - **Email:** `manager@brandguard.ai`
   - **Password:** `manager123`
   - **Capabilities:** Review queue triage, sign-off approval gate, digital compliance seal issuance, rulebook administration.

3. **✍️ Content Creator:**
   - **Email:** `creator@brandguard.ai` (ya `client@brandguard.ai`)
   - **Password:** `creator123` (ya `client123`)
   - **Capabilities:** Evaluate situations/copy against brand rules, submit to admin queue, view private submissions.

---

## 📡 Core API Endpoints

### 1. Authentication & Telemetry (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login, verifies credentials, logs login session, returns JWT access token
- `GET /api/auth/me` — Get current user identity & role
- `GET /api/auth/sessions` — *(Admin only)* Real-time login sessions & IP telemetry
- `POST /api/auth/sessions/{id}/revoke` — *(Admin only)* Revoke/terminate an active user session

### 2. Review & Approval Pipeline (`/api/reviews`)
- `POST /api/reviews/evaluate` — User evaluates situation/draft with Dual-Engine (Rule Engine + Gemini AI). **Automatically dispatches to Admin Queue with status strictly set to `Pending`!**
- `GET /api/reviews` — List review submissions (Creators see only their own; Admins see all)
- `GET /api/reviews/{id}` — Inspect detailed findings & quotes
- `POST /api/reviews/{id}/signoff` — *(Admin / Manager only)* Approves submission, sets status to `Approved`, generates digital compliance certificate seal
- `POST /api/reviews/{id}/request-changes` — Request revisions from Creator
- `POST /api/reviews/{id}/reject` — Reject submission

### 3. Rulebook Management (`/api/rules`)
- `GET /api/rules` — List all brand rules (R1 to R4)
- `POST /api/rules` — *(Admin / Manager)* Create new brand rule
- `PATCH /api/rules/{id}` — *(Admin / Manager)* Toggle active state or update severity

### 4. Audit History (`/api/audit`)
- `GET /api/audit` — Get all permanent compliance audit trails
- `GET /api/audit/export` — Download audit history as CSV file
