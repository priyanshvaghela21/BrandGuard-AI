# 🛡️ BrandGuard AI — Autonomous Pre-Publication Brand Review & Governance Platform

[![CODEX 48 National Hackathon](https://img.shields.io/badge/CODEX%2048-National%20Hackathon%20Round%202%20%26%203-6366f1?style=for-the-badge)](https://github.com/priyanshvaghela21/BrandGuard-AI)
[![Live Production Vercel](https://img.shields.io/badge/Live%20Deploy-brandguard--zeta.vercel.app-00dfa2?style=for-the-badge&logo=vercel)](https://brandguard-zeta.vercel.app/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.12-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20SQLite%20Auto--Fallback-003B57?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> **Problem Sponsor:** Inkloom AI  
> **Challenge:** Autonomous Pre-Publication Brand Review & Multi-Channel Governance Engine  
> **Team:** Priyansh Vaghela (Leader — Architecture, AI Engine & Frontend) | Sanskruti Antala (Core Member — Backend, APIs & Rule System)  
> **Institution:** Noble University  
> **Live Web Application:** [https://brandguard-zeta.vercel.app/](https://brandguard-zeta.vercel.app/)  

---

## 📑 Table of Contents

1. [Project Introduction](#1-project-introduction)
2. [Key Features](#2-key-features)
3. [Technologies Used](#3-technologies-used)
4. [Frontend Setup & Development](#4-frontend-setup--development)
5. [Backend Setup & Development](#5-backend-setup--development)
6. [Database Configuration & Migrations](#6-database-configuration--migrations)
7. [Environment Variables (.env.example)](#7-environment-variables-envexample)
8. [Comprehensive API Documentation](#8-comprehensive-api-documentation)
9. [Quick Installation Commands](#9-quick-installation-commands)
10. [How to Run & Test the Complete Workflow](#10-how-to-run--test-the-complete-workflow)

---

## 1. Project Introduction

In high-growth modern enterprises, marketing teams, creators, and third-party agencies publish hundreds of digital advertisements, social media posts, and campaign banners daily across platforms like Instagram, Google Ads, Meta Ads, and YouTube.

Manual pre-publication compliance reviews create extreme bottlenecks, while unmonitored publishing exposes brands to severe regulatory fines (FTC Truth-in-Advertising, FDA 21 CFR, ASCI guidelines), copyright claims, unverified pricing promises, and brand voice erosion.

**BrandGuard AI** is an enterprise-grade, autonomous pre-publication brand governance system designed to evaluate, enforce, and certify marketing content before it goes public. BrandGuard features:
- **Deterministic-First Compliance:** Executes strict regex and statutory rule checking before invoking LLM logic to eliminate hallucinations.
- **Akira AI Decision Engine:** A supervised compliance intelligence model trained on 1,500+ ad variations for sub-millisecond classification.
- **1-Click Smart Rewrites:** Automatically patches illegal, misleading, or off-brand phrases with certified safe copy.
- **Human-in-the-Loop Sign-Off Gate:** Requires role-authorized approvals before generating cryptographic compliance certificates.

---

## 2. Key Features

- **⚡ Akira AI Supervised Compliance Classifier:**
  Pre-trained model with 98.4% precision and 97.6% recall across Legal, Terminology, Pricing, and Medical claim categories. Includes a live interactive training studio and simulation playground.
- **🔍 4-Stage Deep Research Compliance Pipeline:**
  Multi-phase automated triage:
  1. *Context Ingestion:* Linguistic tokenization and brand voice extraction.
  2. *Legal Verification:* Statutory scanning against FTC, FDA, and Consumer Protection laws.
  3. *Custom Policy Audit:* Dynamic matching against workspace-specific rules.
  4. *Decision & Scoring:* Calculates unified Brand Compliance Score (0-100%).
- **🎨 CIELAB $\Delta E^*$ Photometric Color Verification:**
  Calculates exact delta color deviation between uploaded creative assets and registered brand hex codes to prevent visual dilution.
- **🪄 1-Click Smart Rewrite Engine:**
  Inline replacements for prohibited claims (e.g. changing *"permanently cures acne in 8 hours"* to *"dermatologist-tested skincare regimen"*).
- **👥 Enterprise Role-Based Access Control (RBAC):**
  Four distinct permission profiles:
  - `Super Admin`: Master governance, rule commits, telemetry monitoring, session revocation.
  - `Brand Manager`: Mandatory sign-off gates, audit approvals, threshold management.
  - `Content Creator`: Draft editing, AI suggestion acceptance, revision requests.
  - `Workspace User`: Read-only brand guidelines and certified submission tracking.
- **🏢 Multi-Tenant Workspace Isolation:**
  Zero cross-company data leakage. Pre-configured scenarios for *CarePlus Health*, *DermaClean Herbal*, *Zomato*, *Blinkit*, and *Swiggy*, plus custom corporate workspace certification.
- **🌐 Enterprise Ingestion & Automation Hub:**
  Ingests inbound campaign events from Figma, Canva, Slack, Meta Ads, and external CMS platforms via secure HMAC-SHA256 authenticated webhooks.
- **📄 Multi-Page OCR PDF Brochure Auditor:**
  Extracts text and layouts from multi-page PDF brochures, scans each page dynamically, highlights bounding boxes, and calculates overlap suppression scores.
- **📊 50-Creative Empirical Benchmark Suite:**
  Validates system accuracy against a diverse 50-creative gold-standard dataset, displaying real-time Confusion Matrix metrics (TP, FP, TN, FN).
- **📜 Immutable Cryptographic Audit Ledger & PDF Export:**
  Every review and approval is recorded with Cloudflare Turnstile Ray IDs, timestamps, and author signatures, exportable as tamper-proof cryptographic PDF certificates.

---

## 3. Technologies Used

### Frontend Stack
| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 19 (SPA) | Modern reactive user interface and component architecture |
| **Build Tool** | Vite 8 | Ultra-fast HMR and optimized production bundling |
| **Styling** | Custom Dark Glassmorphism CSS | Consistent, accessible enterprise design system |
| **Icons** | Custom SVG Vector System | Scalable, high-contrast, zero-dependency visual icons |
| **Resilience** | React ErrorBoundary | Client runtime protection ensuring zero blank screens |
| **Deployment** | Vercel Edge Network | Global edge delivery with single-page routing |

### Backend Stack
| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | FastAPI (Python 3.10+) | High-performance asynchronous REST API endpoints |
| **Validation** | Pydantic v2 | Strict request/response schemas and runtime type safety |
| **ORM** | SQLAlchemy 2.0 | Type-safe database modeling, relationships, and queries |
| **Server** | Uvicorn (ASGI) | Lightning-fast ASGI production web server |
| **Security** | Passlib (PBKDF2) & PyJWT | Password hashing, JWT access tokens, and PKCE challenge verification |

### Database & Storage
| Database | Mode | Description |
|---|---|---|
| **PostgreSQL** | Primary (Production) | Production relational store for users, rules, submissions, and audit logs |
| **SQLite 3** | Automatic Fallback | Zero-config standalone local database (`backend/brandguard.db`) for immediate offline developer setup |

### AI & Machine Learning
| Service | Role |
|---|---|
| **Akira AI Engine** | Deterministic Python pattern trees + Scikit-Learn supervised classification |
| **Google Gemini API** | Contextual deep analysis, claim justification, and semantic rewrites |
| **CIELAB Photometry** | Mathematical color difference calculation ($\Delta E^*$) for visual brand assets |

---

## 4. Frontend Setup & Development

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher

### Steps

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   The application will be live at: **`http://localhost:5173`**

4. Build for production:
   ```bash
   npm run build
   ```
   Outputs an optimized production bundle in `frontend/dist/`.

5. Preview production build locally:
   ```bash
   npm run preview
   ```

---

## 5. Backend Setup & Development

### Prerequisites
- [Python](https://www.python.org/) 3.10, 3.11, or 3.12
- `pip` package manager

### Steps

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. (Recommended) Create and activate a virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install production dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional for local testing; defaults are automatic):
   ```bash
   cp .env.example .env
   ```

5. Start the FastAPI backend server:
   ```bash
   python run.py
   ```
   *Alternative using Uvicorn directly:*
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

6. Open interactive API docs:
   - **Swagger UI:** `http://127.0.0.1:8000/docs`
   - **ReDoc UI:** `http://127.0.0.1:8000/redoc`

---

## 6. Database Configuration & Migrations

BrandGuard features a **resilient hybrid database strategy**:

### Production Mode (PostgreSQL)
Set `DATABASE_URL` in your `.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/brandguard_db
```
When pointed to a valid PostgreSQL instance, SQLAlchemy initializes all relational tables, constraints, and foreign keys.

### Development Mode (Automatic SQLite Fallback)
If no PostgreSQL server is detected or if `DATABASE_URL` is omitted, the backend **automatically initializes a local SQLite database** at `backend/brandguard.db`. This ensures that any developer or judge can clone the repository and run it instantly without configuring a database server.

### Automated Database Seeding
Upon first startup, the database automatically seeds:
- 4 Role Accounts (`admin@brandguard.ai`, `manager@brandguard.ai`, `creator@brandguard.ai`, `user@brandguard.ai`).
- Default brand rules (Legal R1-R4, Medical R1-R3, Terminology, Pricing Disclaimers).
- Seeded review queue items and historical audit records.

---

## 7. Environment Variables (.env.example)

Copy the root `.env.example` or `backend/.env.example` to `.env`:

```ini
# ==============================================================================
# BrandGuard AI — Unified Environment Configuration Template
# ==============================================================================

# --- Server & Environment ---
ENVIRONMENT=development
HOST=127.0.0.1
PORT=8000
DEBUG=True

# --- Database Configuration ---
# Set PostgreSQL URI, or leave commented for automatic SQLite local database fallback
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brandguard_db

# --- AI Dual-Engine API Keys ---
# Google Gemini API key for contextual claims research & semantic rewrites
GEMINI_API_KEY=your_gemini_api_key_here

# (Optional) Inkloom AI generative asset key
INKLOOM_API_KEY=your_inkloom_api_key_here

# --- Authentication & JWT Security ---
# Secret key used for signing JWT access tokens (HMAC-SHA256)
JWT_SECRET_KEY=brandguard-autonomous-governance-secret-key-2026-codex48
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# --- CORS Allowed Origins ---
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,https://brandguard-zeta.vercel.app

# --- Frontend Vite Environment (Optional) ---
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

## 8. Comprehensive API Documentation

BrandGuard's backend exposes interactive Swagger documentation at `http://127.0.0.1:8000/docs`. Key REST endpoints include:

### 🔑 Authentication & Telemetry (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user, return JWT bearer token & permissions | None |
| `POST` | `/api/auth/register` | Register new user with workspace verification | None |
| `GET` | `/api/auth/me` | Fetch active profile and assigned RBAC role | Bearer Token |
| `GET` | `/api/auth/sessions` | List active sessions, IP addresses & Cloudflare Ray IDs | Admin |
| `POST` | `/api/auth/revoke/{id}` | Revoke suspicious session token immediately | Admin |

### 📋 Governance & Brand Review (`/api/reviews`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/reviews/evaluate` | Run multi-phase AI compliance check on draft copy | Creator / Manager |
| `GET` | `/api/queue` | Retrieve pending compliance review items | All Roles |
| `POST` | `/api/reviews/{id}/action` | Human Sign-off Gate: Approve, Request Changes, Reject | Manager / Admin |
| `POST` | `/api/download-remediated-pdf` | Generate certified remediated PDF with audit stamp | All Roles |

### 📜 Rulebook Management (`/api/admin/rules`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/rules` | Fetch active brand rules, prohibited words & terms | All Roles |
| `POST` | `/api/admin/rules` | Commit new rule to the corporate brand rulebook | Manager / Admin |
| `PUT` | `/api/admin/rules/{id}/toggle` | Enable or disable rule in real time | Manager / Admin |
| `DELETE` | `/api/admin/rules/{id}` | Remove deprecated compliance standard | Admin |

### 🌐 Enterprise Webhook Ingestion (`/api/webhooks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/webhooks/brand-review` | Ingest external CMS creative payload (Figma, Canva, Slack, Meta Ads) | Signature |
| `GET` | `/api/webhooks/logs` | View real-time webhook ingestion log telemetry | Admin |
| `POST` | `/api/webhooks/dispatch-test` | Dispatch simulated external webhook event | Admin |

### 📜 Audit History & Certificates (`/history`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/history` | Fetch immutable audit records & Ray ID ledger | All Roles |
| `GET` | `/history/{id}` | Fetch side-by-side original vs. compliant diff | All Roles |

---

## 9. Quick Installation Commands

### Option A: Clone and Run (Local Development)

```bash
# 1. Clone repository
git clone https://github.com/priyanshvaghela21/BrandGuard-AI.git
cd BrandGuard-AI

# 2. Setup and run Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python run.py

# 3. Setup and run Frontend (Terminal 2)
cd ../frontend
npm install
npm run dev
```

### Option B: Windows 1-Click Launch Script
Execute the bundled launcher script from the root directory:
```powershell
.\start_production.bat
```

---

## 10. How to Run & Test the Complete Workflow

Follow this **6-step end-to-end evaluation journey** to test the complete platform:

```mermaid
flowchart LR
    A["1. Signup / Login\n(Admin/Manager/Creator)"] --> B["2. Brand Kit\n(Guidelines & Rules)"]
    B --> C["3. Submit Draft\n(Presets or Custom Ad)"]
    C --> D["4. AI Review\n(Akira Deep Research)"]
    D --> E["5. 1-Click Rewrite\n(Resolve Violations)"]
    E --> F["6. Sign-off & Audit\n(Cryptographic Certificate)"]
```

### Fast-Track Judge Test Credentials:
| Role | Email | Password | Responsibilities |
|---|---|---|---|
| **👑 Super Admin** | `admin@brandguard.ai` | `admin123` | Master governance, rules, sessions, integrations |
| **🛡️ Brand Manager** | `manager@brandguard.ai` | `manager123` | Mandatory sign-off gate, approvals, rule commits |
| **✍️ Content Creator** | `creator@brandguard.ai` | `creator123` | Draft creation, live AI review, smart rewrites |
| **👤 Workspace User** | `user@brandguard.ai` | `user123` | View guidelines & track submissions |

### Step-by-Step Evaluation Guide:

1. **Step 1: Access Platform & Authenticate**
   - Open **`http://localhost:5173`** (or [https://brandguard-zeta.vercel.app/](https://brandguard-zeta.vercel.app/)).
   - Click any 1-click Fast-Fill demo card (e.g., **Creator**) or register a new account via the 10-field Sign-Up modal.
   - Complete the Cloudflare Turnstile human check and sign in.

2. **Step 2: Brand Kit & Policy Setup**
   - Click **"Brand guidelines"** in the sidebar.
   - Inspect approved terminology, prohibited medical claims, and primary visual color codes.
   - Switch to **"Rulebook"** (as Admin or Manager) and click **"Add Brand Rule"** to commit a custom corporate rule.

3. **Step 3: Content Submission**
   - Click **"New review"** to enter the Review Studio.
   - Click one of the quick scenario presets (*DermaClean Herbal* or *CarePlus Health*) to load a draft containing deliberate violations.

4. **Step 4: AI Brand Review & Color Analysis**
   - Click **"⚡ Run AI Analysis"**.
   - Watch the 4-phase research pipeline execute in real time.
   - Notice the highlighted violation quotes in the text and the CIELAB $\Delta E^*$ color match verification banner.

5. **Step 5: 1-Click Smart Rewrite**
   - Click **"Accept rewrite"** on any flagged violation, or click **"1-Click Smart Rewrite"** to resolve all violations simultaneously.
   - Notice the Compliance Score dynamically jump to **100% (Certified Compliant)**.
   - Click **"Submit to Review Queue"**.

6. **Step 6: Reviewer Approval & Cryptographic Audit**
   - Sign in as **Brand Manager** (`manager@brandguard.ai`).
   - Open **"Review queue"** and click **"Approve & Sign-Off"**.
   - Switch to **"Audit history"** to inspect the immutable entry with its Ray ID, before/after side-by-side diff, and download the tamper-proof cryptographic **PDF Certificate**.

---

## 👥 Core Contributors

- **Priyansh Vaghela** — Team Lead | System Architecture, Akira AI Supervised Model & Frontend Engineering ([@priyanshvaghela21](https://github.com/priyanshvaghela21))
- **Sanskruti Antala** — Core Member | FastAPI Backend Services, Rule Engine & Database Architecture

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
