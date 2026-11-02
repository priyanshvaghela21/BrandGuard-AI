# CODEX 48 | NATIONAL LEVEL HACKATHON
## ROUND 2 SUBMISSION & MASTER PROJECT DOCUMENTATION
### BrandGuard: Autonomous Pre-Publication Brand Review & Governance Platform

---

## 1. Project & Team Information
- **Project Name:** BrandGuard
- **Team Leader (Frontend):** Priyansh Vaghela (priyanshvaghela4@gmail.com)
- **Core Member (Backend / AI):** Sanskruti Antala (sanskrutiantala@gmail.com)
- **Institution:** Noble University
- **Problem Statement Owner:** Inkloom AI
- **Core Brief:** Brand consistency across employees, agencies, and generative AI tools.

---

## 2. Executive Summary & Progress from Round 1 (20 Points)

### The Problem We Solved:
Organizations publish hundreds of marketing creatives daily across Instagram, LinkedIn, and ad networks through diverse teams, regional agencies, and AI copy generators. Content creation is instant, but brand review remains manual, inconsistent, and slow. Off-brand claims damage credibility, while unverified health or performance promises incur legal and regulatory penalties.

### Round 1 Concept to Round 2 Working Software:
- **Round 1:** We proposed a theoretical dual-engine architecture combining deterministic rules with Gemini LLM context and human approval gates.
- **Round 2 Progress:** We turned the concept into a **fully working, zero-friction software application**. 
  - Creators can enter **any brand name** (e.g. *EcoSip Water Bottles*, *GlowGoddess Skincare Cream*, *CarePlus Health Policy*), custom brand rules, and ad copy.
  - The engine performs **line-by-line rule auditing**, categorizing results into actionable statuses (`Violation`, `Unclear`, `Pass`).
  - Output is formatted with **verified evidence**, **clear explanations**, **ready suggested rewrites**, and **relational database audit logging**.

---

## 3. Working Core Workflow & Implementation (30 Points)

### The End-to-End User Journey:
1. **Rule & Creative Ingestion:** The creator specifies campaign parameters (Brand Name, Platform, Line-by-line custom brand policies, and marketing copy).
2. **Dual-Engine Audit Execution:**
   - **Deterministic Guardrail (Engine 1):** Scans for absolute superlatives (`100% leakproof`, `removes wrinkles in 7 days`), unverified clinical/environmental claims, and missing mandatory brand slogans.
   - **Gemini Contextual AI (Engine 2):** Parses nuanced phrasing and evaluates whether factual backing exists in the draft.
3. **Structured 3-Tier Issue Breakdown:** Every checked rule yields:
   - **Status:** `Violation` (Red badge), `Unclear` (Amber badge), or `Pass` (Green badge).
   - **Rule Title & Identifier:** e.g., `Rule 1 — Overnight permanent acne cure`.
   - **❌ Found in Ad (Flagged Phrase):** The exact offending text snippet extracted from the draft (e.g., *"permanently cures acne in 8 hours"*).
   - **⚠️ Why Wrong (Policy Breach Explanation):** Clear legal/brand rationale (e.g., *"Claims permanent cure without dermatological certification"*).
   - **✅ Compliant Fix (Ready Alternative):** Drop-in compliant replacement ready for immediate use (e.g., *"Helps visibly reduce acne overnight"*).
4. **Intent-Preserving Compliant Copy Generation:** The platform synthesizes an alternative version of the draft that keeps the marketing appeal while stripping regulatory liabilities, complete with a 1-click clipboard copy utility.
5. **Mandatory Human Sign-Off Gate (Role-Based Access Control):** Autonomous publishing is strictly blocked. Content creators (e.g. Priyansh) cannot self-approve (showing an active `🔒 Approve (Manager Only)` lock); only accounts authenticated with the Brand Manager role (e.g. Sanskruti) have the authority to digitally sign off (`[✅ Sign-Off & Approve]`) and release campaigns, generating an immutable approval timestamp in the audit database.
6. **Persistent Audit History:** All reviewed records, timestamps, risk levels, and rule breakdowns are saved to an embedded SQLite / PostgreSQL relational database.

---

## 4. Technical Depth & Reliability (25 Points)

| Layer | Technology | Role & Why It Was Chosen |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3.11/3.12 + FastAPI | High-throughput asynchronous REST API endpoints with auto-generated OpenAPI documentation. |
| **Data Validation** | Pydantic v2 | Strict schema validation ensuring incoming drafts and outgoing AI JSON payloads are clean and type-safe. |
| **Database Engine** | SQLAlchemy ORM + SQLite/PostgreSQL | Zero-configuration local database with complete relational schema, transactional integrity, and easy cloud scalability. |
| **AI Intelligence** | Google Gemini API (1.5 Flash) | Contextual linguistic analysis, nuanced claim evaluation, and smart few-shot rewrites. |
| **Resilience Guardrail** | Python Heuristic Fallback Engine | Prevents demo failure during network throttling or Gemini API rate-limits, guaranteeing 100% uptime. |
| **User Interface** | HTML5, Modern CSS, Vanilla JS | Ultra-fast, lightweight, responsive client with zero build-step overhead, instant load times, and pre-built demo scenarios. |

---

## 5. Explanation of Changes Made to Original Plan

1. **Universal Rule Engine vs. Hardcoded Rulebooks:**
   - *Original Plan:* Stored a static pre-defined rulebook for one mock brand.
   - *Improvement in Round 2:* Upgraded to a **Universal Dynamic Review Engine**. Users can audit *any product* (consumer goods, cosmetics, SaaS, healthcare) by entering custom guidelines on the fly.
2. **Database Auto-Fallback for Competition Usability:**
   - *Original Plan:* Depended strictly on external PostgreSQL daemon.
   - *Improvement in Round 2:* Added auto-detecting SQLite with SQLAlchemy ORM. This allows hackathon judges to launch and evaluate the application with a single click without setting up database servers.
3. **Resilient Dual-Mode Execution:**
   - Engineered an offline rule evaluation fallback that ensures judges never see connection timeouts or blank screens even under strict network sandboxes.

---

## 6. Three Major Planned Improvements for Round 3 (15 Points)

*(Substantial, meaningful product enhancements planned for the final round)*:

### 1. Multimodal 2D Banner Color & Contrast Auditor (CIELAB & WCAG 2.1)
- **What it does:** In addition to text copy, Round 3 will ingest 2D promotional banners (PNG/JPEG).
- **Technology:** OpenCV + Pillow + Delta-E CIELAB mathematical formulas.
- **Value:** Automatically computes text-to-background contrast ratios (ensuring WCAG AA 4.5:1 accessibility compliance) and detects whether banner background colors violate the brand's approved hex palette.

### 2. Quantitative Tone-Alignment Scoring (0–100 Scale)
- **What it does:** Calculates a numeric compliance score (0–100) reflecting brand voice consistency.
- **Technology:** Gemini API contextual scoring across 4 orthogonal dimensions (*Authority*, *Empathy*, *Scientific Rigor*, *Simplicity*).
- **Value:** Gives marketing teams an objective metric to track brand drift across external PR agencies and freelance copywriters.

### 3. Enterprise Recurring-Mistake Analytics & Rule Evolution
- **What it does:** Provides compliance managers with aggregated trend reports of the most frequently violated guidelines.
- **Technology:** SQL aggregation heatmaps and rule clustering.
- **Value:** Flags ambiguous or overly strict rules that confuse creators, enabling continuous refinement of company brand books.

---

## 7. Usability & Judge Verification Guide (10 Points)

### Instant 1-Click Testing Flow:
1. Double-click `D:\BrandGuard\Run_BrandGuard.bat` (or run `uvicorn main:app --reload --port 8000`).
2. Open browser at: **`http://localhost:8000/app`**.
3. **Inspect Active Review:**
   - Observe real-time **Ad Compliance Score (`Score: 30 / 100`)** and **`HIGH RISK`** badge.
   - Inspect the **3-Tier Actionable Cards**:
     - `❌ Found in Ad:` The exact offending snippet (e.g., *"permanently cures acne in 8 hours"*).
     - `⚠️ Why Wrong:` Clear regulatory/brand breach rationale.
     - `✅ Compliant Fix:` Ready-to-use compliant alternative wording.
4. **Test Role-Based Governance (RBAC):**
   - Click the top-right profile avatar and switch to **Priyansh (Creator)**.
   - Observe that the sign-off gate shows **`🔒 Approve (Manager Only)`** with an access restriction notice.
   - Switch back to **Sanskruti (Brand Manager)**.
   - Click **`[✅ Sign-Off & Approve]`** to witness the digital signature stamp (`APPROVED ✅ by Sanskruti (Brand Manager)`) saved into the relational database.
5. **Test Zero-Friction Reset & Reload:**
   - Click **`+ New review`** to clear inputs and results for auditing any custom brand draft.
   - Click **`✨ Reload DermaClean Demo`** to restore the full sample evaluation in 1 second.
6. **Audit History Verification:**
   - Click **`Audit history`** in the sidebar to inspect user-isolated historical logs retrieved from SQLite / PostgreSQL.
