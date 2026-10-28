# 🛡️ BrandGuard — Autonomous Pre-Publication Brand Review & Governance Platform

[![CODEX 48 Hackathon](https://img.shields.io/badge/CODEX%2048-National%20Hackathon%20Round%202-6366f1?style=for-the-badge)](https://github.com/priyanshvaghela21/BrandGuard-AI)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python%203.12-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20SQLAlchemy-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20SPA-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **Problem Sponsor:** Inkloom AI  
> **Team:** Priyansh Vaghela (Leader — Architecture & Frontend) | Sanskruti Antala (Core Member — Backend & Rule Engine)  
> **Institution:** Noble University  

---

## ⚡ Fast-Track Judge Evaluation Logins

Judges can test all 4 Role-Based Access Control (RBAC) tiers instantly without signup:

| Role | Username / Email | Password | Access & Responsibilities |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `admin@brandguard.ai` | `admin123` | Full access: Rulebooks, System Settings, Audit Trails & User Provisioning |
| **🛡️ Brand Manager** | `manager@brandguard.ai` | `manager123` | Final Human Sign-off, Analytics, Rule Approvals & Governance Thresholds |
| **✍️ Content Creator** | `creator@brandguard.ai` | `creator123` | Draft Editor, Live Review Studio, Akira AI Suggestions & Revision Submission |
| **👤 Workspace User** | `user@brandguard.ai` | `user123` | Read-only inspection of brand guidelines & compliance history |

*(Tip: In the Live Demo UI, click **"⚡ Fast-Fill Credentials"** or the demo shortcuts for 1-click login!)*

---

## 🌟 Akira AI: The Autonomous Cognitive Thinker & Operator

BrandGuard does not simply produce raw text suggestions; it operates as an **Autonomous Pre-Publication Safety Guardian**:

1. **Cognitive Boundary Highlighting:** When hovering or tapping any flagged phrase in the live editor, the exact sentence boundary animates in sync with the rule violation card.
2. **Deterministic-First Engine (Zero Hallucination):** Regex and pattern trees enforce non-negotiable legal and trademark rules before LLM contextual analysis.
3. **4-Tier Risk Assessment Meter:** Dynamically computes:
   - 🔴 **High Risk:** Legal liabilities, unsubstantiated claims (`100% cure`).
   - 🟡 **Moderate Risk:** Disallowed terminology (`user` instead of `patient`).
   - 🔵 **Normal Risk:** Minor brand tone discrepancies.
   - 🟢 **Safe:** Compliant copy ready for publication.
4. **1-Click Active Transformation:** Judges can click **"Accept Rewrite"** to immediately patch the copy in real-time.

---

## 📁 Repository Structure

```
BrandGuard-AI/
├── frontend/                        # React 19 + Vite Frontend SPA
│   ├── src/                         # Components, ReviewStudio, Analytics, Modals
│   ├── public/                      # Static assets & interactive demo player
│   ├── package.json                 # Frontend dependencies & scripts
│   ├── vite.config.js               # Vite bundler configuration
│   └── vercel.json                  # SPA routing configuration
├── backend/                         # FastAPI Python Backend
│   ├── app/
│   │   ├── database/                # SQLite connection & session
│   │   ├── engine/                  # Deterministic Rule Engine & AI Scanners
│   │   ├── models/                  # SQLAlchemy ORM (Users, Rules, Audits)
│   │   ├── routers/                 # REST Endpoints (/auth, /rules, /review, /audit)
│   │   └── schemas/                 # Pydantic validation schemas
│   ├── requirements.txt             # Python dependencies
│   └── run.py                       # FastAPI entrypoint
├── BrandGuard_Round2_Submission_Report.pdf  # Comprehensive 9-page Hackathon Submission PDF
├── BrandGuard_Akira_AI_Demo_Video.mp4       # 35-second HD Akira AI feature demonstration
├── vercel.json                      # Root Vercel zero-config pipeline
└── docker-compose.yml               # Unified container orchestrator
```

---

## 🚀 Quickstart: Run Locally

### 1. Frontend (React 19 + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### 2. Backend (FastAPI + Python 3.12)
```bash
cd backend
pip install -r requirements.txt
python run.py
```
Backend API interactive Swagger docs run at **`http://localhost:8000/docs`**.

> **Note on Seamless Offline Mode:** Even if the backend server is stopped, BrandGuard's built-in intelligent client simulation immediately kicks in, ensuring judges experience zero friction or broken pages during evaluation!

---

## 🌐 Instant Vercel Cloud Deployment

BrandGuard is pre-configured for **1-click zero-latency deployment** on Vercel:
1. Push this repository to GitHub.
2. Link the repository in [Vercel](https://vercel.com/new).
3. The included `vercel.json` automatically builds the `frontend/` package and configures single-page routing (`/index.html`).
4. Instant global edge delivery with <0.5s cold-start response time for judges.

---

## 📄 Submission Deliverables
- **Official PDF Report:** [`BrandGuard_Round2_Submission_Report.pdf`](./BrandGuard_Round2_Submission_Report.pdf) (Complete architecture, P0/P1 feature maps, and Round 3 roadmap).
- **Akira AI Demo Video:** [`BrandGuard_Akira_AI_Demo_Video.mp4`](./BrandGuard_Akira_AI_Demo_Video.mp4).
