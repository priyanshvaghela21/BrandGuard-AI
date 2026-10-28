import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable, Preformatted
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Two-pass canvas to dynamically compute and draw total page count, header bar, and footer."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Top Header Accent Bar
        self.setStrokeColor(colors.HexColor("#1E3A8A"))
        self.setLineWidth(3.5)
        self.line(40, 762, 572, 762)
        
        # Footer text & dividing line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.6)
        self.line(40, 36, 572, 36)
        
        self.drawString(40, 24, "BrandGuard | Team Priyansh Vaghela | Noble University | CODEX 48 Round 2")
        self.drawRightString(572, 24, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()


def build_pdf():
    pdf_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), "BrandGuard_Round2_Submission_Report.pdf")
    
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=46,
        bottomMargin=46
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0F2942")     # Deep Corporate Navy
    SECONDARY = colors.HexColor("#1E3A8A")   # Royal Blue
    ACCENT = colors.HexColor("#0D9488")      # Teal / Mint
    TEXT_DARK = colors.HexColor("#1E293B")   # Slate 800
    TEXT_MUTED = colors.HexColor("#475569")  # Slate 600
    BG_LIGHT = colors.HexColor("#F8FAFC")    # Slate 50
    BG_CARD = colors.HexColor("#F1F5F9")     # Slate 100
    BORDER = colors.HexColor("#CBD5E1")      # Slate 300
    CODE_BG = colors.HexColor("#0F172A")     # Slate 900 Dark for tree
    HIGHLIGHT_GOLD = colors.HexColor("#FEF3C7") # Amber 100 for credentials box
    HIGHLIGHT_BORDER = colors.HexColor("#D97706") # Amber 600 border

    # Custom Typography Styles
    style_kicker = ParagraphStyle(
        'DocKicker',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=SECONDARY,
        textTransform='uppercase',
        spaceAfter=4
    )

    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Title'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=PRIMARY,
        alignment=0,
        spaceAfter=3
    )

    style_subtitle = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceAfter=3
    )

    style_tagline = ParagraphStyle(
        'DocTagline',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=TEXT_MUTED,
        spaceAfter=8
    )

    style_h1 = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=12.5,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=9,
        spaceAfter=4,
        keepWithNext=True
    )

    style_h2 = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=SECONDARY,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    style_body = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=TEXT_DARK,
        spaceAfter=4
    )

    style_table_header = ParagraphStyle(
        'TableHeader_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.2,
        leading=10.5,
        textColor=colors.white
    )

    style_table_cell = ParagraphStyle(
        'TableCell_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=10.8,
        textColor=TEXT_DARK
    )

    style_table_cell_bold = ParagraphStyle(
        'TableCellBold_Custom',
        parent=style_table_cell,
        fontName='Helvetica-Bold'
    )

    style_callout = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11.2,
        textColor=TEXT_DARK
    )

    style_cred_header = ParagraphStyle(
        'CredHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#92400E")
    )

    style_cred_body = ParagraphStyle(
        'CredBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#78350F")
    )

    style_code_tree = ParagraphStyle(
        'CodeTreeText',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=9,
        textColor=colors.HexColor("#E2E8F0")
    )

    story = []

    # ══════════════════════════════════════════════════════════════
    # PAGE 1: COVER, HIGHLIGHTED JUDGES CREDENTIALS & PROBLEM STATEMENT
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("CODEX 48 | NATIONAL LEVEL HACKATHON | ROUND 2: WORKING PRODUCT REPORT", style_kicker))
    story.append(Paragraph("BrandGuard", style_title))
    story.append(Paragraph("Autonomous Pre-Publication Brand Review and Governance Platform", style_subtitle))
    story.append(Paragraph("Our answer to the Inkloom AI brief: keep every brand claim, colour, and tone consistent, trustworthy, and reviewable before publication.", style_tagline))

    # ── HIGHLIGHTED CREDENTIALS CALLOUT BOX (PROMINENT AT START OF PDF FOR JUDGES) ──
    cred_box_data = [
        [
            Paragraph("<b>🔑 FAST-TRACK EVALUATOR LOGIN CREDENTIALS (JUDGES QUICK ACCESS)</b>", style_cred_header)
        ],
        [
            Paragraph(
                "To evaluate BrandGuard live without wasting time, use the following pre-seeded, role-authorized credentials. "
                "Each role connects to an isolated workspace, permission level, and dedicated operational playbook:<br/>"
                "• 👑 <b>Super Admin:</b> &nbsp;<code>admin@brandguard.ai</code> &nbsp;|&nbsp; Password: <b>admin123</b> &nbsp;(Root Console, Live Telemetry & Security Audit Ledger)<br/>"
                "• 🛡️ <b>Brand Manager:</b> &nbsp;<code>manager@brandguard.ai</code> &nbsp;|&nbsp; Password: <b>manager123</b> &nbsp;(Review Queue Triage, CIELAB & WCAG Sign-Off Gate)<br/>"
                "• ✍️ <b>Content Creator:</b> &nbsp;<code>creator@brandguard.ai</code> &nbsp;|&nbsp; Password: <b>creator123</b> &nbsp;(Content Studio, 1-Click Smart Rewrites, Inkloom $100)<br/>"
                "• 👤 <b>Workspace User:</b> &nbsp;<code>user@brandguard.ai</code> &nbsp;|&nbsp; Password: <b>user123</b> &nbsp;(Copy Submission, Guidelines Explorer & Tracking)<br/>"
                "<b>💡 Evaluator Instruction:</b> On the login screen, slide the <i>'Verify you are human'</i> widget and click <i>'Continue with Email'</i> to enter.",
                style_cred_body
            )
        ]
    ]
    t_cred = Table(cred_box_data, colWidths=[532])
    t_cred.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HIGHLIGHT_GOLD),
        ('BOX', (0, 0), (-1, -1), 1.5, HIGHLIGHT_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_cred)
    story.append(Spacer(1, 8))

    # Team & Project Metadata Table
    meta_data = [
        [Paragraph("<b>Team Name (in records)</b>", style_table_cell_bold), Paragraph("Priyansh Vaghela", style_table_cell)],
        [Paragraph("<b>Team Members & Roles</b>", style_table_cell_bold), Paragraph("<b>Priyansh Vaghela</b> (Leader, Frontend) &nbsp;|&nbsp; <b>Sanskruti Antala</b> (Core Member, Backend / AI)", style_table_cell)],
        [Paragraph("<b>Institution</b>", style_table_cell_bold), Paragraph("Noble University", style_table_cell)],
        [Paragraph("<b>Core Solution Idea</b>", style_table_cell_bold), Paragraph("Hybrid engine: deterministic Python rules (repeatable) + Gemini LLM (context, rewrites) + Evidence Verifier guardrail + mandatory human sign-off gate.", style_table_cell)],
        [Paragraph("<b>Problem Owner / Brief</b>", style_table_cell_bold), Paragraph("<b>Inkloom AI:</b> Brand consistency across employees, agencies, and generative AI tools.", style_table_cell)],
        [Paragraph("<b>Round 2 Working Status</b>", style_table_cell_bold), Paragraph("<b>100% Core Workflow Functional:</b> End-to-end ingestion, AI scan, 1-click smart rewrite, review queue triage, and cryptographic sign-off seal.", style_table_cell)]
    ]
    meta_table = Table(meta_data, colWidths=[130, 402])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), BG_CARD),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 6))

    # Section 1: Problem Statement
    story.append(Paragraph("1. Understanding of the Problem Statement", style_h1))
    story.append(Paragraph(
        "Modern organisations publish promotional content simultaneously through dozens of distributed employees, regional teams, external agencies, and generative AI tools. Content creation speed has skyrocketed, but <b>brand review remains subjective, manual, and dangerously slow (48-72 hours)</b>. The Inkloom AI brief isolates four devastating corporate failure types: <i>incorrect claims, outdated corporate information, inconsistent brand language, and off-brand visual aesthetics</i>. In regulated industries (healthcare, insurance, finance), these failures lead directly to regulatory penalties, mandatory ad recalls, and permanent brand equity erosion.",
        style_body
    ))

    # Illustrative Scenario Callout
    scenario_content = [
        [Paragraph("<b>Worked Illustrative Incident: 'CarePlus' Health-Tech Diwali Campaign</b><br/>"
                   "A junior creator drafts: <i>\"Our healthcare policy guarantees 100% cure for all illnesses with zero fees!\"</i> with an unapproved neon purple banner (<code>#9851E0</code>) with low contrast.<br/>"
                   "<b>(1) Legal Risk:</b> Absolute guarantee claims and unasterisked zero-fee claims violate medical advertising laws.<br/>"
                   "<b>(2) Visual Risk:</b> Background color deviates by 38.4 CIELAB from brand palette, and contrast ratio (2.3:1) fails WCAG AA standards.<br/>"
                   "<b>BrandGuard Resolution:</b> Scans draft in 2 seconds, cites Rules R1 & R2, auto-replaces violation with verified clinical claims, recalculates palette to Brand Navy (<code>#001F3F</code>), and saves cryptographic sign-off seal in the audit ledger.",
                   style_callout)]
    ]
    scenario_table = Table(scenario_content, colWidths=[532])
    scenario_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#38BDF8")),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(scenario_table)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 2: USERS AFFECTED & END-TO-END WORKFLOW JOURNEY
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("2. The Users Affected & Product Workflow", style_h1))
    story.append(Paragraph(
        "BrandGuard is designed for multi-tiered enterprise organizations, agencies, and lean teams where brand compliance is currently a painful tug-of-war between velocity and risk.",
        style_body
    ))

    user_table_data = [
        [Paragraph("User Persona", style_table_header), Paragraph("Operational Pain Today", style_table_header), Paragraph("What BrandGuard Delivers in Round 2", style_table_header)],
        [
            Paragraph("<b>Content Creators</b><br/>(Copywriters, Designers)", style_table_cell),
            Paragraph("Vague, delayed feedback (\"feels off-brand\") with no exact rule citations or fixes.", style_table_cell),
            Paragraph("Instant dual-engine scan, verbatim quoted evidence, and <b>1-click smart rewrite</b> replacement.", style_table_cell)
        ],
        [
            Paragraph("<b>Brand Managers</b><br/>(Sign-Off Authority)", style_table_cell),
            Paragraph("Fatigue from manual proofreading; no audit trail; unable to track recurring violations.", style_table_cell),
            Paragraph("Pre-triaged review queue, CIELAB delta-E auditor, WCAG contrast verification, and 1-click sign-off seal.", style_table_cell)
        ],
        [
            Paragraph("<b>Super Admins</b><br/>(Governance & IT)", style_table_cell),
            Paragraph("Uncontrolled AI copy generation, security blind spots, zero compliance provenance.", style_table_cell),
            Paragraph("Root command console, live user session telemetry, and immutable SHA-256 cryptographic audit logs.", style_table_cell)
        ],
        [
            Paragraph("<b>Agencies & Clients</b><br/>(Multi-Workspace)", style_table_cell),
            Paragraph("Severe risk of cross-applying Client A's guidelines to Client B's marketing creatives.", style_table_cell),
            Paragraph("Isolated brand workspaces (e.g. CarePlus Health, DermaClean Herbal) with dedicated rulebooks.", style_table_cell)
        ]
    ]
    user_table = Table(user_table_data, colWidths=[120, 190, 222])
    user_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(user_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("End-to-End Governed Product Journey", style_h2))
    story.append(Paragraph(
        "In Round 2, the complete product journey is fully functional across 4 decoupled phases:",
        style_body
    ))

    journey_steps = [
        [
            Paragraph("<b>Step 1: Auth & Ingestion</b><br/>Author authenticates via role-based credentials. Draft text & channel selected in Content Studio.", style_table_cell),
            Paragraph("<b>Step 2: Dual-Engine Scan</b><br/>Deterministic Python checks + Gemini contextual analysis run in parallel under 2 seconds.", style_table_cell),
            Paragraph("<b>Step 3: Guardrail & Fix</b><br/>Evidence Verifier drops hallucinations. Author accepts 1-click rewrite to update draft editor.", style_table_cell),
            Paragraph("<b>Step 4: Sign-Off & Seal</b><br/>Manager reviews queue, verifies CIELAB & WCAG contrast, and issues tamper-proof audit seal.", style_table_cell)
        ]
    ]
    journey_table = Table(journey_steps, colWidths=[133, 133, 133, 133])
    journey_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_CARD),
        ('BOX', (0, 0), (-1, -1), 1, BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(journey_table)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 3: AKIRA AI (THE AUTONOMOUS AI THINKER & GOVERNANCE CORE)
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("3. Akira AI: The Autonomous Cognitive Thinker & Operator", style_h1))
    story.append(Paragraph(
        "A common question evaluators ask is: <i>\"Does Akira AI merely output passive suggestion text, or does it actively perform operational cognitive work?\"</i> "
        "In BrandGuard, <b>Akira AI functions as an autonomous, multi-stage governance thinker and active operator</b>. It executes deep contextual analysis, verifies evidence, mutates the editor live in 1-click, and autonomously routes compliance decisions.",
        style_body
    ))

    akira_jobs = [
        [Paragraph("Cognitive Job", style_table_header), Paragraph("How Akira AI 'Thinks' & Operates on Our Website", style_table_header)],
        [
            Paragraph("<b>1. Multi-Dimensional Safety & Tone Analysis</b>", style_table_cell_bold),
            Paragraph("Akira AI does not merely match keywords. It performs cognitive semantic analysis: calculating toxicity (e.g. <code>99% Brand Safe</code>), detecting voice sentiment (e.g. <i>'Clinical & Empathetic'</i> vs aggressive hype), and isolating unverified claims.", style_table_cell)
        ],
        [
            Paragraph("<b>2. Evidence Verifier Thinking (Anti-Hallucination)</b>", style_table_cell_bold),
            Paragraph("Akira AI tests its own hypotheses against ground-truth facts. It ensures that every finding references a stored, verified Rule ID (R1, R2, R4) and verbatim quoted text. If an AI thought fails verbatim matching, it is discarded immediately.", style_table_cell)
        ],
        [
            Paragraph("<b>3. Interactive Bidirectional Evidence Linking</b><br/><i>(Why Borders Highlight on Touch)</i>", style_table_cell_bold),
            Paragraph("When a creator or judge touches/clicks any violation box in the UI, Akira AI's evidence graph lights up the exact matching phrase in the draft editor with glowing borders. This provides <b>complete explainability and provenance</b>—proving the finding is physically rooted in the draft, not generated in a black-box.", style_table_cell)
        ],
        [
            Paragraph("<b>4. 1-Click Smart Rewrite (Active Editor Mutation)</b>", style_table_cell_bold),
            Paragraph("Rather than leaving advice for the author to manually re-type, clicking <i>'Accept rewrite'</i> prompts Akira AI to mutate the draft editor text in-place, instantly recalculate compliance score from 40 to 100, and elevate risk from High Risk 🔴 to Safe 🟢.", style_table_cell)
        ],
        [
            Paragraph("<b>5. Autonomous Decision Routing (Stage 04)</b>", style_table_cell_bold),
            Paragraph("Akira AI actively triages the asset into 3 governance paths: <b>Auto-Resolve</b> (score ≥ 80%), <b>Escalate to Brand Manager</b> (ambiguous / tone drift), or <b>Immediate Disqualification</b> (score &lt; 45% or illegal medical cures).", style_table_cell)
        ]
    ]
    t_akira = Table(akira_jobs, colWidths=[140, 392])
    t_akira.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_akira)
    story.append(Spacer(1, 8))

    # Akira AI Callout
    akira_summary_box = [
        [Paragraph("<b>💡 Key Takeaway on Akira AI:</b><br/>"
                   "Akira AI is not a chatbot. It is a deterministic-augmented cognitive supervisor. It thinks (analyzes claims & tone), protects (drops hallucinations via the Evidence Verifier), and acts (live 1-click editor replacement & automated routing).",
                   style_callout)]
    ]
    t_akira_sum = Table(akira_summary_box, colWidths=[532])
    t_akira_sum.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#3B82F6")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_akira_sum)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 4: DUAL-ENGINE DATA FLOW DIAGRAM & GUARDRAILS
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("4. Dual-Engine Architecture & Visual Data Flow", style_h1))
    story.append(Paragraph(
        "BrandGuard combines repeatable Python regex algorithms with Google Gemini LLM reasoning behind a strict Evidence Verifier filter before human review.",
        style_body
    ))

    flow_diagram_text = (
        "[Creator Draft] ──> [Input Sanitization] ──> [Parallel Dual-Engine Scan]\n"
        "                                                      │\n"
        "         ┌────────────────────────────────────────────┴────────────────────────────────────────────┐\n"
        "         ▼                                                                                         ▼\n"
        "[Engine 1: Deterministic Python Regex]                                          [Engine 2: Gemini Contextual LLM]\n"
        "(Banned Phrases, Superlatives, Fees)                                            (Tone, Semantic Claims, Rewrites)\n"
        "         │                                                                                         │\n"
        "         └────────────────────────────────────────────┬────────────────────────────────────────────┘\n"
        "                                                      ▼\n"
        "                                      [Evidence Verifier Guardrail]\n"
        "                              (Discards Hallucinations & Unverified Quotes)\n"
        "                                                      │\n"
        "                                                      ▼\n"
        "                                     [1-Click Smart Rewrite Loop]\n"
        "                                (Creator Accepts / Rejects Compliant Text)\n"
        "                                                      │\n"
        "                                                      ▼\n"
        "                                  [Review Queue (Strictly 'Pending')]\n"
        "                                                      │\n"
        "                                                      ▼\n"
        "                                   [Brand Manager CIELAB & WCAG Gate]\n"
        "                              (Color Distance ΔE* & Contrast AA Verification)\n"
        "                                                      │\n"
        "                                                      ▼\n"
        "                               [Human Sign-Off & Cryptographic Audit Seal]\n"
        "                            (Permanent SHA-256 Ledger Logging in PostgreSQL)"
    )
    t_diag = Table([[Preformatted(flow_diagram_text, style_code_tree)]], colWidths=[532])
    t_diag.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODE_BG),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#334155")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(t_diag)
    story.append(Spacer(1, 8))

    # Competitive Comparison Table
    diff_table_data = [
        [Paragraph("Governance Capability", style_table_header), Paragraph("Generic LLM / Chatbot", style_table_header), Paragraph("Static Linter / Regex", style_table_header), Paragraph("BrandGuard Platform", style_table_header)],
        [
            Paragraph("<b>Rule Grounding</b>", style_table_cell_bold),
            Paragraph("Hallucinates or cites non-existent rules", style_table_cell),
            Paragraph("Matches only exact hardcoded patterns", style_table_cell),
            Paragraph("Verified against stored rule IDs & quotes", style_table_cell)
        ],
        [
            Paragraph("<b>Visual & Contrast</b>", style_table_cell_bold),
            Paragraph("Cannot compute mathematical color distance", style_table_cell),
            Paragraph("Text-only; zero layout/color awareness", style_table_cell),
            Paragraph("Mathematical CIELAB & WCAG formulas", style_table_cell)
        ],
        [
            Paragraph("<b>Compliant Fixes</b>", style_table_cell_bold),
            Paragraph("Generic advice; alters original message", style_table_cell),
            Paragraph("Error flags only; no rewrites provided", style_table_cell),
            Paragraph("1-Click smart rewrites preserving author intent", style_table_cell)
        ],
        [
            Paragraph("<b>Provenance & Audit</b>", style_table_cell_bold),
            Paragraph("No roles, no audit ledger, ephemeral", style_table_cell),
            Paragraph("No sign-off workflow or version control", style_table_cell),
            Paragraph("SHA-256 sign-off seal & immutable audit log", style_table_cell)
        ]
    ]
    diff_table = Table(diff_table_data, colWidths=[110, 140, 130, 152])
    diff_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(diff_table)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 5: COMPLETE PROJECT REPOSITORY FILE STRUCTURE
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("5. Complete Project Repository File Structure", style_h1))
    story.append(Paragraph(
        "BrandGuard is maintained as a clean, production-grade monorepo containing decoupled client and server architectures with clear separation of concerns.",
        style_body
    ))

    repo_tree_text = (
        "brandguard/\n"
        "├── backend/                               # Python 3.11 + FastAPI REST Gateway\n"
        "│   ├── app/\n"
        "│   │   ├── ai/                            # Generative AI & Reasoning Services\n"
        "│   │   │   ├── gemini_service.py          # Google Gemini 1.5 Flash contextual engine & rewrites\n"
        "│   │   │   └── inkloom_service.py         # Inkloom AI $100 credit studio asset generation\n"
        "│   │   ├── auth/                          # Authentication & Access Control (RBAC)\n"
        "│   │   │   ├── dependencies.py            # Route security guards (get_current_user, require_admin)\n"
        "│   │   │   └── security.py                # JWT token encoding/decoding & bcrypt password hashing\n"
        "│   │   ├── engine/                        # Core Governance & Validation Logic\n"
        "│   │   │   ├── rule_engine.py             # Deterministic regex, medical absolutes & risk classifier\n"
        "│   │   │   └── routing_engine.py          # 4-stage decision router & Evidence Verifier guardrail\n"
        "│   │   ├── models/                        # SQLAlchemy ORM Database Entities\n"
        "│   │   │   ├── user.py                    # User credentials, roles (admin/manager/creator) & sessions\n"
        "│   │   │   ├── rule.py                    # Stored brand rules (R1-R4, JSONB terms & facts)\n"
        "│   │   │   ├── review.py                  # Marketing review items, score, draft & approval state\n"
        "│   │   │   └── audit.py                   # Cryptographic audit ledger with SHA-256 seal signatures\n"
        "│   │   ├── routers/                       # FastAPI REST API Endpoints\n"
        "│   │   │   ├── auth_router.py             # POST /api/auth/login, /token, session telemetry\n"
        "│   │   │   ├── review_router.py           # POST /api/reviews/evaluate, sign-off, queue triage\n"
        "│   │   │   ├── rule_router.py             # GET/POST /api/rules (Rulebook CRUD)\n"
        "│   │   │   ├── audit_router.py            # GET /api/audit (Audit trail, diffs, JSON export)\n"
        "│   │   │   └── inkloom_router.py          # POST /api/inkloom/generate (Multi-channel campaigns)\n"
        "│   │   ├── schemas/                       # Pydantic v2 Strict Request/Response Schemas\n"
        "│   │   │   ├── review.py                  # IssueSchema, ReviewEvaluateRequest, ReviewResponse\n"
        "│   │   │   ├── user.py                    # UserSchema, TokenSchema, LoginPayload\n"
        "│   │   │   ├── rule.py                    # RuleSchema, RuleCreatePayload\n"
        "│   │   │   └── audit.py                   # AuditLogSchema, CertificateSchema\n"
        "│   │   ├── config.py                      # Environment configuration & API credentials\n"
        "│   │   ├── database.py                    # SQLAlchemy dual-engine (SQLite local + PostgreSQL cloud)\n"
        "│   │   └── main.py                        # FastAPI entrypoint, CORS, OpenAPI Swagger (/docs)\n"
        "│   ├── brandguard.db                      # Local pre-seeded SQLite database for judge evaluation\n"
        "│   ├── Dockerfile                         # Production containerization configuration\n"
        "│   ├── requirements.txt                   # Python backend dependencies\n"
        "│   ├── run.py                             # Development server launcher (port 8000)\n"
        "│   └── test_api.py                        # Automated backend unit & integration test suite\n"
        "├── src/                                   # React 18 + Vite Frontend Application\n"
        "│   ├── components/                        # Modular UI Components\n"
        "│   │   └── AkiraWorkflowPipeline.jsx      # Interactive 4-stage pipeline flowchart & role matrix\n"
        "│   ├── App.jsx                            # Core application integrating all views & RBAC guides\n"
        "│   ├── data.js                            # Seeded CarePlus rules, queue items & audit history\n"
        "│   ├── styles.css                         # Dark-theme design system, SVG auditors & glowing badges\n"
        "│   ├── index.css                          # Tailwind CSS root styling\n"
        "│   └── main.jsx                           # React DOM root entrypoint\n"
        "├── public/                                # Static visual assets & SVG icons\n"
        "├── Dockerfile                             # Root container specification\n"
        "├── docker-compose.yml                     # Unified multi-service orchestration\n"
        "├── package.json                           # Node.js dependencies & Vite scripts\n"
        "└── BrandGuard_Round2_Submission_Report.pdf# Official Round 2 Hackathon Project Report"
    )

    t_tree = Table([[Preformatted(repo_tree_text, style_code_tree)]], colWidths=[532])
    t_tree.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), CODE_BG),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#334155")),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(t_tree)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 6: COMPLETED FEATURES IN ROUND 2 (P0 & P1 DELIVERABLES)
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("6. List of Completed Features in Round 2", style_h1))
    story.append(Paragraph(
        "In Round 2, the team focused on delivering a 100% working core text review journey with zero broken links or non-functional mockups. All 6 P0 features committed in Round 1 are operational, plus key P1 stretch features were delivered ahead of schedule.",
        style_body
    ))

    feat_table_data = [
        [Paragraph("Feature Name", style_table_header), Paragraph("Priority", style_table_header), Paragraph("Implementation Details & Technology", style_table_header), Paragraph("Round 2 Status", style_table_header)],
        [
            Paragraph("<b>Role-Based Governance (RBAC)</b>", style_table_cell),
            Paragraph("P0 (Must)", style_table_cell_bold),
            Paragraph("FastAPI JWT auth with 4 isolated personas (Super Admin, Brand Manager, Content Creator, Workspace User). Role-locked playbooks.", style_table_cell),
            Paragraph("✅ 100% Functional", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Structured Rulebook</b>", style_table_cell),
            Paragraph("P0 (Must)", style_table_cell_bold),
            Paragraph("Database-backed schema (R1 to R4) categorizing rules by severity, banned keywords, approved nomenclature, and evidence criteria.", style_table_cell),
            Paragraph("✅ 100% Functional", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Rule-Based Text Checks</b>", style_table_cell),
            Paragraph("P0 (Must)", style_table_cell_bold),
            Paragraph("Deterministic Python regex engine detecting absolute medical guarantees, promotional discount caps, and missing asterisk disclaimers.", style_table_cell),
            Paragraph("✅ 100% Functional", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Unsupported-Claim Verifier</b>", style_table_cell),
            Paragraph("P0 (Must)", style_table_cell_bold),
            Paragraph("Google Gemini API prompt integration evaluating subtle claims and superlatives, returning structured Pydantic v2 JSON.", style_table_cell),
            Paragraph("✅ 100% Functional", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Evidence Verifier Guardrail</b>", style_table_cell),
            Paragraph("P0 (Must)", style_table_cell_bold),
            Paragraph("Drop filter discarding hallucinated citations where quotes are absent from submitted draft text or rule IDs are unverified.", style_table_cell),
            Paragraph("✅ 100% Functional", style_table_cell_bold)
        ],
        [
            Paragraph("<b>1-Click Smart Rewriter</b>", style_table_cell),
            Paragraph("P0 (Must)", style_table_cell_bold),
            Paragraph("Contextual compliant rewrites; authors click \"Accept rewrite\" to instantly replace violating text and recalculate compliance score.", style_table_cell),
            Paragraph("✅ 100% Functional", style_table_cell_bold)
        ],
        [
            Paragraph("<b>CIELAB Colour Checker</b>", style_table_cell),
            Paragraph("P1 (Stretch)", style_table_cell),
            Paragraph("Visual CIELAB Delta-E (ΔE*) color space distance calculating off-brand deviations against CarePlus primary Navy & Teal palettes.", style_table_cell),
            Paragraph("🌟 Delivered Early", style_table_cell_bold)
        ],
        [
            Paragraph("<b>WCAG 2.1 AA Contrast Checker</b>", style_table_cell),
            Paragraph("P1 (Stretch)", style_table_cell),
            Paragraph("Mathematical contrast ratio formula verifying text vs. background readability against standard 4.5:1 AA compliance threshold.", style_table_cell),
            Paragraph("🌟 Delivered Early", style_table_cell_bold)
        ],
        [
            Paragraph("<b>AI Risk Assessment Card</b>", style_table_cell),
            Paragraph("P1 (Stretch)", style_table_cell),
            Paragraph("4-Tier visual risk classification matrix (High Risk 🔴, Moderate 🟡, Normal 🔵, Safe 🟢) with live diagnostic guidance.", style_table_cell),
            Paragraph("🌟 Delivered Early", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Inkloom AI Studio Integration</b>", style_table_cell),
            Paragraph("P1 (Stretch)", style_table_cell),
            Paragraph("Dedicated $100 hackathon credit marketing asset generator tailored directly for problem sponsor brief.", style_table_cell),
            Paragraph("🌟 Delivered Early", style_table_cell_bold)
        ]
    ]
    feat_table = Table(feat_table_data, colWidths=[120, 60, 262, 90])
    feat_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(feat_table)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 7: TECHNOLOGY STACK & IMPLEMENTATION DETAILS
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("7. Technology Stack & Implementation Details", style_h1))
    story.append(Paragraph(
        "BrandGuard is architected as an enterprise-grade web application combining a responsive React 18 client with a high-throughput Python 3.11 FastAPI backend.",
        style_body
    ))

    tech_table_data = [
        [Paragraph("Layer", style_table_header), Paragraph("Technology Choice", style_table_header), Paragraph("Architectural Rationale", style_table_header)],
        [
            Paragraph("<b>Frontend UI</b>", style_table_cell_bold),
            Paragraph("React 18 + Vite + Tailwind CSS", style_table_cell),
            Paragraph("Ultra-fast sub-second HMR development, responsive design, interactive highlighted text diffs, and SVG visual auditors.", style_table_cell)
        ],
        [
            Paragraph("<b>Backend API</b>", style_table_cell_bold),
            Paragraph("Python 3.11 + FastAPI", style_table_cell),
            Paragraph("Asynchronous ASGI routing, native typing, interactive OpenAPI/Swagger auto-documentation (<code>/docs</code>), and high throughput.", style_table_cell)
        ],
        [
            Paragraph("<b>Validation</b>", style_table_cell_bold),
            Paragraph("Pydantic v2", style_table_cell),
            Paragraph("Strict runtime schema enforcement on all incoming requests and LLM JSON outputs, ensuring zero unvalidated data touches the UI.", style_table_cell)
        ],
        [
            Paragraph("<b>Database</b>", style_table_cell_bold),
            Paragraph("SQLite (Local) / PostgreSQL 16 (JSONB)", style_table_cell),
            Paragraph("Dual database strategy: SQLite provides zero-config local evaluation for hackathon judges, while SQLAlchemy models natively support PostgreSQL JSONB for enterprise scaling.", style_table_cell)
        ],
        [
            Paragraph("<b>AI Models</b>", style_table_cell_bold),
            Paragraph("Google Gemini API (1.5 Flash)", style_table_cell),
            Paragraph("Low-latency contextual claim verification, brand tone analysis, and few-shot compliant smart rewrites.", style_table_cell)
        ],
        [
            Paragraph("<b>Security & Auth</b>", style_table_cell_bold),
            Paragraph("JWT Tokens + Passlib (bcrypt)", style_table_cell),
            Paragraph("Stateless cryptographic session tokens with role-based permission verification on every REST endpoint.", style_table_cell)
        ],
        [
            Paragraph("<b>Mathematics</b>", style_table_cell_bold),
            Paragraph("Pure Python & JS Math Formulas", style_table_cell),
            Paragraph("Direct mathematical calculation of CIELAB Delta-E (Euclidean color distance) and WCAG 2.1 relative luminance contrast ratios.", style_table_cell)
        ],
        [
            Paragraph("<b>Deployment</b>", style_table_cell_bold),
            Paragraph("Dockerfile & Static Mount", style_table_cell),
            Paragraph("Production-ready containerization; FastAPI gateway mounts frontend production build for unified single-port deployment.", style_table_cell)
        ]
    ]
    tech_table = Table(tech_table_data, colWidths=[90, 160, 282])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("Enterprise Security & Responsible AI Disclosures", style_h2))
    story.append(Paragraph(
        "• <b>Prompt Injection Guardrail:</b> Submitted marketing content is treated strictly as data payloads and never executed as prompt instructions.<br/>"
        "• <b>Confidentiality:</b> Only sanitized draft text necessary for evaluation is transmitted to external AI endpoints; zero user PII or credentials are sent.<br/>"
        "• <b>Graceful Degradation:</b> If the Gemini API experiences network latency or rate-limiting, the deterministic Python engine completes the scan seamlessly without system crashes.",
        style_body
    ))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 8: EXPLANATION OF CHANGES & THREE ROUND 3 IMPROVEMENTS
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("8. Changes Made to Original Plan & Round 3 Improvements", style_h1))

    changes_data = [
        [Paragraph("Plan Dimension", style_table_header), Paragraph("Original Round 1 Plan", style_table_header), Paragraph("Round 2 Refinement & Rationale", style_table_header)],
        [
            Paragraph("<b>P0 Scope</b>", style_table_cell_bold),
            Paragraph("Build 6 core features: login, structured rules, text checks, claim verifier, evidence verifier, rewrites.", style_table_cell),
            Paragraph("<b>100% Preserved:</b> Zero P0 features dropped. Core text review operates from start to finish.", style_table_cell)
        ],
        [
            Paragraph("<b>P1 Stretch Delivery</b>", style_table_cell_bold),
            Paragraph("CIELAB color distance and WCAG contrast checks deferred to Round 3 stretch scope.", style_table_cell),
            Paragraph("<b>Accelerated Early:</b> Delivered visual CIELAB color-distance (ΔE*) auditor and WCAG AA contrast ratio calculator in Round 2.", style_table_cell)
        ],
        [
            Paragraph("<b>Role Authorization</b>", style_table_cell_bold),
            Paragraph("Basic role access with shared playbook switcher tabs.", style_table_cell),
            Paragraph("<b>Strict RBAC Isolation:</b> Multi-role switcher tabs removed from guide modal; each persona strictly accesses their own playbook.", style_table_cell)
        ],
        [
            Paragraph("<b>AI Risk Categorization</b>", style_table_cell_bold),
            Paragraph("Numeric compliance score (0-100) only.", style_table_cell),
            Paragraph("<b>Added 4-Tier Risk Matrix:</b> Added High Risk 🔴, Moderate 🟡, Normal 🔵, Safe 🟢 matrix with active guidance.", style_table_cell)
        ]
    ]
    changes_table = Table(changes_data, colWidths=[105, 195, 232])
    changes_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(changes_table)
    story.append(Spacer(1, 8))

    story.append(Paragraph("Three Substantive Improvements for Round 3", style_h2))

    imp_data = [
        [
            Paragraph("<b>Improvement 1: Multi-Format PDF Brochure & Deck Audit Engine (OCR & Alt-Text)</b><br/>"
                      "Expanding from raw text/banners to multi-page corporate PDF brochures and presentation decks. Utilizing <code>pdfplumber</code> and Gemini Vision OCR to extract embedded text, analyze rasterized graphics, verify contrast ratios, and enforce WCAG image alt-text metadata.", style_table_cell)
        ],
        [
            Paragraph("<b>Improvement 2: Automated 50-Creative Benchmark Evaluation Suite (Precision/Recall/F1)</b><br/>"
                      "Implementing a rigorous automated test harness benchmarking 50 labelled ground-truth marketing creatives (25 compliant + 25 known violations across medical, promotional, and tone rules) to report verified precision, recall, and F1-score confusion matrices.", style_table_cell)
        ],
        [
            Paragraph("<b>Improvement 3: Enterprise CMS & Design Tool Webhooks (Figma / Canva / Slack Pre-Publish Gate)</b><br/>"
                      "Constructing bidirectional REST webhooks allowing designers to trigger automated pre-publication audits directly inside Figma, Canva, or Slack before exporting final assets, creating true 'CI/CD for Marketing'.", style_table_cell)
        ]
    ]
    imp_table = Table(imp_data, colWidths=[532])
    imp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#60A5FA")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(imp_table)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════════
    # PAGE 9: EXPECTED IMPACT & PARTICIPANT SIGN-OFF
    # ══════════════════════════════════════════════════════════════
    story.append(Paragraph("9. Expected Impact, Verification & Team Sign-Off", style_h1))

    # Impact Comparison Table
    impact_data = [
        [Paragraph("Impact Metric", style_table_header), Paragraph("Current Traditional Workflow", style_table_header), Paragraph("BrandGuard Governed Target", style_table_header)],
        [
            Paragraph("<b>First Feedback Velocity</b>", style_table_cell),
            Paragraph("48 to 72 hours via scattered emails and Slack threads", style_table_cell),
            Paragraph("<b>Instant deterministic checks; under 2 seconds for AI scan</b>", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Reviewer Fatigue</b>", style_table_cell),
            Paragraph("Reviewers manually re-check standard rules on dozens of assets", style_table_cell),
            Paragraph("<b>Routine checks pre-triaged; reviewer focuses only on judgment calls</b>", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Explainability & Action</b>", style_table_cell),
            Paragraph("Subjective comments (\"this looks off-brand\" / \"rewrite this\")", style_table_cell),
            Paragraph("<b>Exact rule ID citation, verbatim quoted evidence, and 1-click rewrite</b>", style_table_cell_bold)
        ],
        [
            Paragraph("<b>Auditability & Legal Record</b>", style_table_cell),
            Paragraph("Approvals buried in unrecorded chat messages; zero provenance", style_table_cell),
            Paragraph("<b>Timestamped cryptographic SHA-256 seal and permanent ledger</b>", style_table_cell_bold)
        ]
    ]
    t_impact = Table(impact_data, colWidths=[120, 206, 206])
    t_impact.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_impact)
    story.append(Spacer(1, 10))

    # Team Participant Details
    story.append(Paragraph("Complete Team & Participant Details", style_h2))
    team_data = [
        [Paragraph("Participant Name", style_table_header), Paragraph("Event Role", style_table_header), Paragraph("Registered Email", style_table_header), Paragraph("Institution", style_table_header)],
        [
            Paragraph("<b>Priyansh Vaghela</b>", style_table_cell),
            Paragraph("Team Leader", style_table_cell),
            Paragraph("priyanshvaghela4@gmail.com", style_table_cell),
            Paragraph("Noble University", style_table_cell)
        ],
        [
            Paragraph("<b>Sanskruti Antala</b>", style_table_cell),
            Paragraph("Core Member", style_table_cell),
            Paragraph("sanskrutiantala@gmail.com", style_table_cell),
            Paragraph("Noble University", style_table_cell)
        ]
    ]
    t_team = Table(team_data, colWidths=[130, 95, 175, 132])
    t_team.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0, 0), (-1, -1), 4.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_team)
    story.append(Spacer(1, 8))

    # Sign-Off & Originality Declaration Box
    signoff_data = [
        [Paragraph("<b>Responsible AI & Originality Disclosure</b><br/>"
                   "All application source code, deterministic rule engine algorithms, Pydantic schemas, and orchestration logic were conceived and engineered by the team for the CODEX 48 National Hackathon. Open-source libraries (React 18, FastAPI, SQLAlchemy, Pydantic) are used under their permissive licenses. The Google Gemini API is utilized as an external reasoning model for contextual analysis strictly under human-guided guardrails.<br/><br/>"
                   "<b>Official Team Name in Event Records:</b> Priyansh Vaghela<br/>"
                   "<b>Team Leader Sign-Off:</b> Priyansh Vaghela &nbsp;&nbsp;|&nbsp;&nbsp; <b>Core Member Sign-Off:</b> Sanskruti Antala<br/>"
                   "<b>Round 2 Submission Date:</b> 29 October 2026",
                   style_callout)]
    ]
    t_signoff = Table(signoff_data, colWidths=[532])
    t_signoff.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_CARD),
        ('BOX', (0, 0), (-1, -1), 1, BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ]))
    story.append(t_signoff)

    # Build the document with two-pass NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"SUCCESS: PDF generated at: {pdf_filename}")
    return pdf_filename


if __name__ == "__main__":
    build_pdf()
