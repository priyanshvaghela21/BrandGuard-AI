import os
import sys
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def get_font(name="segoeui.ttf", size=20, bold=False):
    font_path = f"C:/Windows/Fonts/{name}"
    if bold:
        bold_path = f"C:/Windows/Fonts/segoeuib.ttf"
        if os.path.exists(bold_path):
            font_path = bold_path
    if not os.path.exists(font_path):
        font_path = "C:/Windows/Fonts/arial.ttf"
    try:
        return ImageFont.truetype(font_path, size)
    except:
        return ImageFont.load_default()

def create_demo_video():
    output_filename = os.path.join(os.path.dirname(os.path.abspath(__file__)), "BrandGuard_Akira_AI_Demo_Video.mp4")
    
    width = 1280
    height = 720
    fps = 24
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_filename, fourcc, float(fps), (width, height))
    
    # Color Constants
    BG_DARK = (13, 23, 31)         # #0d171f
    BG_PANEL = (17, 33, 44)        # #11212c
    BG_CARD = (22, 41, 54)         # #162936
    MINT = (186, 245, 127)         # #baf57f
    CORAL = (255, 147, 117)        # #ff9375
    AMBER = (251, 191, 36)         # #fbbf24
    BLUE = (96, 165, 250)          # #60a5fa
    TEXT_WHITE = (237, 244, 245)   # #edf4f5
    TEXT_MUTED = (130, 156, 169)   # #829ca9
    BORDER = (38, 57, 68)          # #263944
    BORDER_GLOW = (186, 245, 127)  # #baf57f
    RED_ACCENT = (239, 68, 68)     # #ef4444

    f_title = get_font("segoeui.ttf", 36, bold=True)
    f_h1 = get_font("segoeui.ttf", 26, bold=True)
    f_h2 = get_font("segoeui.ttf", 20, bold=True)
    f_body = get_font("segoeui.ttf", 17, bold=False)
    f_body_bold = get_font("segoeui.ttf", 17, bold=True)
    f_small = get_font("segoeui.ttf", 14, bold=False)
    f_small_bold = get_font("segoeui.ttf", 14, bold=True)
    f_mono = get_font("consola.ttf", 15, bold=False)

    def draw_top_nav(draw, active_step="Stage 01"):
        # Header bar
        draw.rectangle([(0, 0), (width, 60)], fill=(9, 17, 23))
        draw.line([(0, 60), (width, 60)], fill=(32, 50, 62), width=1)
        
        # Logo
        draw.ellipse([(28, 16), (54, 42)], fill=MINT)
        draw.text((36, 19), "B", font=f_h2, fill=(10, 20, 26))
        draw.text((64, 18), "BrandGuard", font=f_h1, fill=TEXT_WHITE)
        draw.text((214, 22), "• Autonomous AI Governance Engine", font=f_small, fill=TEXT_MUTED)
        
        # Pipeline Steps
        steps = [
            ("1", "Draft Ingestion"),
            ("2", "Dual-Engine Scan"),
            ("3", "Evidence Verifier"),
            ("4", "1-Click Rewrite"),
            ("5", "Review Queue"),
            ("6", "Sign-Off Seal")
        ]
        
        start_x = 580
        for idx, (num, label) in enumerate(steps):
            is_active = active_step in f"Stage 0{idx+1}" or active_step == label
            bg_col = MINT if is_active else (25, 42, 53)
            txt_col = (10, 20, 26) if is_active else TEXT_MUTED
            x = start_x + (idx * 114)
            
            draw.rectangle([(x, 18), (x + 104, 44)], fill=bg_col, outline=(50, 75, 90), width=1)
            draw.text((x + 8, 24), f"{num}. {label[:10]}", font=f_small_bold, fill=txt_col)

    def render_and_write(img, repeat_frames=1):
        # Convert PIL RGB to OpenCV BGR
        frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        for _ in range(repeat_frames):
            out.write(frame)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 1: TITLE & EXECUTIVE INTRO (4 SECONDS = 96 FRAMES)
    # ══════════════════════════════════════════════════════════════════
    for t in range(fps * 4):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        
        # Decorative background grid & glow
        for x in range(0, width, 40):
            draw.line([(x, 0), (x, height)], fill=(16, 28, 38), width=1)
        for y in range(0, height, 40):
            draw.line([(0, y), (width, y)], fill=(16, 28, 38), width=1)
            
        # Center Banner Card
        card_box = [(220, 140), (1060, 580)]
        draw.rectangle(card_box, fill=BG_PANEL, outline=(42, 68, 86), width=2)
        
        # Badge
        draw.rectangle([(470, 180), (810, 212)], fill=(20, 50, 45), outline=MINT, width=1)
        draw.text((490, 187), "CODEX 48 | NATIONAL LEVEL HACKATHON", font=f_small_bold, fill=MINT)
        
        # Main Title
        draw.text((380, 235), "BrandGuard", font=ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 52), fill=TEXT_WHITE)
        draw.text((320, 310), "How Akira AI Operates: From Draft to Certified Seal", font=f_h1, fill=BLUE)
        
        # Sub-points
        y_pts = 370
        features = [
            ("⚡ Dual-Engine Analysis:", "Deterministic Python Rules + Google Gemini Contextual AI"),
            ("🛡️ Evidence Verifier:", "Zero-Hallucination Guardrail linking quotes to Rule IDs (R1-R4)"),
            ("✍️ 1-Click Smart Rewrites:", "Instant editor text replacement elevating score to 100%"),
            ("🔒 Mandatory Human Gate:", "CIELAB Delta-E & WCAG contrast audit before SHA-256 seal")
        ]
        for f_label, f_desc in features:
            draw.text((310, y_pts), f_label, font=f_body_bold, fill=MINT)
            draw.text((540, y_pts), f_desc, font=f_body, fill=TEXT_WHITE)
            y_pts += 34
            
        # Team Footer
        draw.text((380, 525), "Team Priyansh Vaghela & Sanskruti Antala • Noble University", font=f_small, fill=TEXT_MUTED)
        
        render_and_write(img, 1)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 2: STAGE 01 - CONTENT INGESTION (4 SECONDS = 96 FRAMES)
    # ══════════════════════════════════════════════════════════════════
    for t in range(fps * 4):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        draw_top_nav(draw, "Stage 01")
        
        # Left Panel: Creator Content Studio Editor
        draw.rectangle([(50, 80), (660, 680)], fill=BG_PANEL, outline=BORDER, width=1)
        draw.text((70, 100), "CONTENT CREATOR STUDIO • NEW REVIEW DRAFT", font=f_small_bold, fill=MINT)
        draw.text((70, 125), "Workspace: CarePlus Health | Channel: Instagram Ads", font=f_small, fill=TEXT_MUTED)
        
        # Text Editor Area
        draw.rectangle([(70, 160), (640, 480)], fill=(10, 18, 24), outline=BORDER, width=1)
        draft_lines = [
            "Meet the future of healthcare with CarePlus.",
            "",
            "Our app guarantees 100% cure overnight with zero fees",
            "for every user, so you can spend less time worrying",
            "and more time living.",
            "",
            "Join millions of user this Diwali! Download today."
        ]
        ly = 180
        for dl in draft_lines:
            draw.text((90, ly), dl, font=f_body, fill=TEXT_WHITE)
            ly += 24
            
        # Scan Button
        pulse = (t // 6) % 2 == 0
        btn_bg = MINT if pulse else (160, 230, 110)
        draw.rectangle([(70, 510), (450, 560)], fill=btn_bg, outline=MINT, width=2)
        draw.text((100, 526), "⚡ Evaluate Situation & Run AI Scan", font=f_h2, fill=(10, 20, 26))
        
        # Right Panel: Awaiting Draft State
        draw.rectangle([(690, 80), (1230, 680)], fill=BG_PANEL, outline=BORDER, width=1)
        draw.text((710, 100), "AKIRA AI DECISION ENGINE", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((710, 125), "Awaiting evaluation trigger...", font=f_small, fill=TEXT_MUTED)
        
        draw.rectangle([(750, 260), (1170, 480)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((860, 330), "⚡ Ready to Analyze", font=f_h1, fill=TEXT_WHITE)
        draw.text((780, 375), "Akira AI will parse claims against CarePlus rulebook R1-R4", font=f_body, fill=TEXT_MUTED)
        draw.text((820, 405), "Testing for regulatory medical violations & tone", font=f_small, fill=BLUE)
        
        render_and_write(img, 1)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 3: STAGE 02 - DUAL-ENGINE SCAN & RISK CLASSIFICATION (5 SECONDS)
    # ══════════════════════════════════════════════════════════════════
    for t in range(fps * 5):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        draw_top_nav(draw, "Stage 02")
        
        # Left Panel: Highlighted Draft Editor
        draw.rectangle([(50, 80), (660, 680)], fill=BG_PANEL, outline=BORDER, width=1)
        draw.text((70, 100), "EVALUATED DRAFT COPY (HIGHLIGHTED VIOLATIONS)", font=f_small_bold, fill=MINT)
        
        draw.rectangle([(70, 135), (640, 430)], fill=(10, 18, 24), outline=BORDER, width=1)
        draw.text((90, 155), "Meet the future of healthcare with CarePlus.", font=f_body, fill=TEXT_WHITE)
        
        # Highlighting "guarantees 100% cure overnight" (Red)
        draw.rectangle([(90, 188), (380, 214)], fill=(120, 30, 30), outline=CORAL, width=1)
        draw.text((94, 192), "Our app guarantees 100% cure overnight", font=f_body_bold, fill=CORAL)
        
        # Highlighting "zero fees" (Amber)
        draw.rectangle([(390, 188), (480, 214)], fill=(100, 70, 20), outline=AMBER, width=1)
        draw.text((394, 192), "with zero fees", font=f_body_bold, fill=AMBER)
        
        draw.text((90, 225), "for every ", font=f_body, fill=TEXT_WHITE)
        # Highlighting "user" (Blue)
        draw.rectangle([(160, 222), (200, 246)], fill=(20, 50, 100), outline=BLUE, width=1)
        draw.text((164, 225), "user", font=f_body_bold, fill=BLUE)
        draw.text((205, 225), ", so you can spend less time worrying...", font=f_body, fill=TEXT_WHITE)
        
        # Interactive Border Highlight Indicator Callout
        draw.rectangle([(70, 455), (640, 655)], fill=(15, 30, 40), outline=BLUE, width=1)
        draw.text((90, 475), "💡 WHY DO BOXES HIGHLIGHT ON TOUCH?", font=f_h2, fill=BLUE)
        draw.text((90, 510), "1. Interactive Evidence Linking:", font=f_body_bold, fill=TEXT_WHITE)
        draw.text((110, 535), "Touching any finding highlights its exact phrase in the editor.", font=f_small, fill=TEXT_MUTED)
        draw.text((90, 565), "2. Verbatim Provenance:", font=f_body_bold, fill=TEXT_WHITE)
        draw.text((110, 590), "Guarantees zero hallucinations — every flag is rooted in the draft.", font=f_small, fill=TEXT_MUTED)
        draw.text((90, 620), "3. Traceable Rule Citation: Shows exact Rule ID (R1, R2, R4).", font=f_small_bold, fill=MINT)

        # Right Panel: 4-Tier Risk Matrix & Finding Cards
        draw.rectangle([(690, 80), (1230, 680)], fill=BG_PANEL, outline=RED_ACCENT, width=2)
        draw.text((710, 100), "AKIRA AI RISK EVALUATION • SCORE: 40 / 100", font=f_small_bold, fill=CORAL)
        
        # 4-Tier Risk Meter Bar
        draw.rectangle([(710, 130), (825, 175)], fill=(100, 25, 25), outline=RED_ACCENT, width=2)
        draw.text((725, 140), "🔴 High Risk", font=f_small_bold, fill=TEXT_WHITE)
        draw.text((735, 157), "< 50 Score", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=CORAL)
        
        draw.rectangle([(835, 130), (955, 175)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((850, 140), "🟡 Moderate", font=f_small, fill=TEXT_MUTED)
        draw.text((865, 157), "50 - 79", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=TEXT_MUTED)

        draw.rectangle([(965, 130), (1085, 175)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((980, 140), "🔵 Normal", font=f_small, fill=TEXT_MUTED)
        draw.text((995, 157), "80 - 94", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=TEXT_MUTED)

        draw.rectangle([(1095, 130), (1215, 175)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((1115, 140), "🟢 Safe", font=f_small, fill=TEXT_MUTED)
        draw.text((1125, 157), "95 - 100", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=TEXT_MUTED)

        # Finding Card 1 (Red Glowing Border)
        draw.rectangle([(710, 195), (1215, 335)], fill=(20, 15, 15), outline=RED_ACCENT, width=2)
        draw.text((725, 205), "R1 · Unsupported medical guarantee", font=f_small_bold, fill=CORAL)
        draw.text((1140, 205), "HIGH", font=f_small_bold, fill=RED_ACCENT)
        draw.text((725, 228), "“guarantees 100% cure overnight”", font=f_body_bold, fill=TEXT_WHITE)
        draw.text((725, 252), "Permanent cure promises violate medical advertising standards.", font=f_small, fill=TEXT_MUTED)
        draw.text((725, 275), "✦ Smart Rewrite: “delivers verified, comprehensive support”", font=f_small_bold, fill=MINT)
        draw.rectangle([(725, 298), (850, 326)], fill=MINT)
        draw.text((740, 305), "Accept rewrite", font=f_small_bold, fill=(10, 20, 26))

        # Finding Card 2
        draw.rectangle([(710, 350), (1215, 485)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((725, 360), "R4 · Missing mandatory disclaimer", font=f_small_bold, fill=AMBER)
        draw.text((1140, 360), "HIGH", font=f_small_bold, fill=AMBER)
        draw.text((725, 383), "“with zero fees”", font=f_body_bold, fill=TEXT_WHITE)
        draw.text((725, 407), "Zero fee claims must include an asterisk referencing conditions.", font=f_small, fill=TEXT_MUTED)
        draw.text((725, 430), "✦ Smart Rewrite: “with zero fees on eligible plans*”", font=f_small_bold, fill=MINT)
        draw.rectangle([(725, 452), (850, 480)], fill=MINT)
        draw.text((740, 459), "Accept rewrite", font=f_small_bold, fill=(10, 20, 26))

        # Finding Card 3
        draw.rectangle([(710, 500), (1215, 620)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((725, 510), "R2 · Terminology nomenclature", font=f_small_bold, fill=BLUE)
        draw.text((1145, 510), "LOW", font=f_small_bold, fill=BLUE)
        draw.text((725, 533), "“user” ➔ Use “customer” or “patient”", font=f_body_bold, fill=TEXT_WHITE)
        draw.rectangle([(725, 575), (850, 603)], fill=MINT)
        draw.text((740, 582), "Accept rewrite", font=f_small_bold, fill=(10, 20, 26))

        render_and_write(img, 1)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 4: STAGE 04 - 1-CLICK REWRITE IN ACTION (5 SECONDS)
    # ══════════════════════════════════════════════════════════════════
    for t in range(fps * 5):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        draw_top_nav(draw, "Stage 04")
        
        # Left Panel: Text Replaced Live in Editor!
        draw.rectangle([(50, 80), (660, 680)], fill=BG_PANEL, outline=MINT, width=2)
        draw.text((70, 100), "DRAFT EDITOR (LIVE 1-CLICK COMPLIANT REWRITE APPLIED)", font=f_small_bold, fill=MINT)
        
        draw.rectangle([(70, 135), (640, 430)], fill=(10, 18, 24), outline=MINT, width=1)
        draw.text((90, 155), "Meet the future of healthcare with CarePlus.", font=f_body, fill=TEXT_WHITE)
        
        # Showing Green Replaced Compliant Copy
        draw.rectangle([(90, 188), (560, 214)], fill=(20, 60, 40), outline=MINT, width=1)
        draw.text((94, 192), "Our app delivers verified, comprehensive support", font=f_body_bold, fill=MINT)
        
        draw.text((90, 225), "with zero fees on eligible plans*", font=f_body_bold, fill=MINT)
        draw.text((370, 225), "for every customer...", font=f_body, fill=TEXT_WHITE)
        
        draw.text((90, 270), "Join millions of customers this Diwali! Download today.", font=f_body, fill=TEXT_WHITE)
        
        # Toast Message Pop
        draw.rectangle([(160, 360), (550, 405)], fill=(15, 45, 30), outline=MINT, width=2)
        draw.text((180, 375), "✓ Applied smart rewrite for R1 & R2 • Score: 100%!", font=f_small_bold, fill=MINT)

        # Submit Button Ready
        draw.rectangle([(70, 460), (450, 510)], fill=(30, 70, 50), outline=MINT, width=2)
        draw.text((110, 478), "🚀 Submit Draft to Review Queue", font=f_h2, fill=MINT)
        
        draw.text((70, 530), "Status strictly sets to 'Pending' until Brand Manager approves.", font=f_small, fill=TEXT_MUTED)

        # Right Panel: 100% Score & Safe Risk Card
        draw.rectangle([(690, 80), (1230, 680)], fill=BG_PANEL, outline=MINT, width=2)
        draw.text((710, 100), "AKIRA AI RISK EVALUATION • SCORE: 100 / 100", font=f_small_bold, fill=MINT)
        
        # 4-Tier Risk Meter Bar showing Safe Highlighted
        draw.rectangle([(710, 130), (825, 175)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((725, 140), "🔴 High", font=f_small, fill=TEXT_MUTED)

        draw.rectangle([(835, 130), (955, 175)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((850, 140), "🟡 Moderate", font=f_small, fill=TEXT_MUTED)

        draw.rectangle([(965, 130), (1085, 175)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((980, 140), "🔵 Normal", font=f_small, fill=TEXT_MUTED)

        draw.rectangle([(1095, 130), (1215, 175)], fill=(20, 70, 45), outline=MINT, width=2)
        draw.text((1115, 140), "🟢 Safe", font=f_small_bold, fill=TEXT_WHITE)
        draw.text((1125, 157), "100 / 100", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=MINT)

        # Resolved Status Card
        draw.rectangle([(710, 200), (1215, 360)], fill=(15, 35, 25), outline=MINT, width=1)
        draw.text((730, 220), "🎉 ALL BRAND COMPLIANCE VIOLATIONS RESOLVED", font=f_h2, fill=MINT)
        draw.text((730, 260), "• Rule R1: Absolute medical claim rewritten to verified clinical support.", font=f_small, fill=TEXT_WHITE)
        draw.text((730, 285), "• Rule R4: Asterisk disclaimer added to promotional zero-fee claim.", font=f_small, fill=TEXT_WHITE)
        draw.text((730, 310), "• Rule R2: Terminology aligned to customer-centric brand guidelines.", font=f_small, fill=TEXT_WHITE)

        # Akira Route Decision
        draw.rectangle([(710, 390), (1215, 520)], fill=(20, 35, 48), outline=BLUE, width=1)
        draw.text((730, 410), "⚡ AKIRA AI ROUTE DECISION: AUTO-RESOLVE", font=f_h2, fill=BLUE)
        draw.text((730, 445), "Status: Content Approved (Limited) with Disclaimer", font=f_body_bold, fill=TEXT_WHITE)
        draw.text((730, 475), "Forwarded to Brand Manager for final cryptographic seal sign-off.", font=f_small, fill=TEXT_MUTED)

        render_and_write(img, 1)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 5: STAGE 05 - BRAND MANAGER REVIEW & VISUAL GATE (5 SECONDS)
    # ══════════════════════════════════════════════════════════════
    for t in range(fps * 5):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        draw_top_nav(draw, "Stage 05")
        
        # Left Panel: Review Queue Triage
        draw.rectangle([(50, 80), (660, 680)], fill=BG_PANEL, outline=BORDER, width=1)
        draw.text((70, 100), "BRAND MANAGER PORTAL • REVIEW QUEUE (TRIAGE)", font=f_small_bold, fill=BLUE)
        
        # Queue item cards
        queue = [
            ("CarePlus Diwali campaign", "Priyansh Vaghela", "Pending", CORAL),
            ("Q4 product announcement", "Nisha Shah", "Changes requested", AMBER),
            ("Customer success email", "Rohan Patel", "Approved", MINT),
            ("Preventive Care Mobile Ad", "Priyansh Vaghela", "Approved", MINT)
        ]
        qy = 140
        for title, author, st, col in queue:
            is_sel = "Diwali" in title
            bg = (25, 45, 60) if is_sel else BG_CARD
            b_col = BLUE if is_sel else BORDER
            draw.rectangle([(70, qy), (640, qy + 60)], fill=bg, outline=b_col, width=2 if is_sel else 1)
            draw.text((85, qy + 12), title, font=f_body_bold, fill=TEXT_WHITE)
            draw.text((85, qy + 35), f"Author: {author} • Submitted 12m ago", font=f_small, fill=TEXT_MUTED)
            draw.rectangle([(520, qy + 16), (620, qy + 44)], fill=(15, 25, 30), outline=col, width=1)
            draw.text((535, qy + 22), st, font=f_small_bold, fill=col)
            qy += 72
            
        draw.rectangle([(70, 450), (640, 650)], fill=(15, 30, 42), outline=BLUE, width=1)
        draw.text((90, 470), "🛡️ BRAND MANAGER SIGN-OFF GATE", font=f_h2, fill=BLUE)
        draw.text((90, 505), "Manager verifies copy, then inspects 2D Banner graphics:", font=f_body, fill=TEXT_WHITE)
        draw.text((90, 535), "1. CIELAB Delta-E (ΔE*) Color Space Distance calculation.", font=f_small, fill=TEXT_MUTED)
        draw.text((90, 565), "2. WCAG 2.1 AA text-to-background contrast ratio (≥ 4.5:1).", font=f_small, fill=TEXT_MUTED)
        draw.text((90, 595), "3. Cryptographic seal certification for zero legal liability.", font=f_small_bold, fill=MINT)

        # Right Panel: Visual CIELAB & WCAG Auditor
        draw.rectangle([(690, 80), (1230, 680)], fill=BG_PANEL, outline=BORDER, width=1)
        draw.text((710, 100), "VISUAL AUDITOR (CIELAB ΔE* & WCAG CONTRAST)", font=f_small_bold, fill=MINT)
        
        # Banner Simulation Box
        draw.rectangle([(710, 135), (1215, 330)], fill=(0, 31, 63), outline=BORDER, width=2) # Navy #001F3F
        draw.text((740, 160), "CAREPLUS FESTIVE HEALTH", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((740, 190), "Festival of Faster, Smarter Care", font=f_h1, fill=TEXT_WHITE)
        draw.text((740, 235), "Empowering every customer with 24/7 verified clinical support.", font=f_body, fill=(200, 220, 235))
        draw.rectangle([(740, 275), (900, 310)], fill=(255, 255, 255))
        draw.text((755, 285), "Book Consultation", font=f_small_bold, fill=(10, 20, 26))

        # Mathematical Metrics Display
        draw.rectangle([(710, 350), (950, 460)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((725, 365), "CIELAB COLOR DISTANCE", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=TEXT_MUTED)
        draw.text((725, 390), "ΔE* = 1.2", font=f_h1, fill=TEXT_WHITE)
        draw.text((725, 425), "✓ Within Brand Palette (ΔE ≤ 12.0)", font=f_small_bold, fill=MINT)

        draw.rectangle([(975, 350), (1215, 460)], fill=BG_CARD, outline=BORDER, width=1)
        draw.text((990, 365), "WCAG 2.1 TEXT CONTRAST", font=ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 11), fill=TEXT_MUTED)
        draw.text((990, 390), "Ratio: 7.4 : 1", font=f_h1, fill=TEXT_WHITE)
        draw.text((990, 425), "✓ Passed WCAG AA (Min 4.5:1)", font=f_small_bold, fill=MINT)

        # Sign-off CTA Button
        draw.rectangle([(710, 490), (1215, 550)], fill=MINT, outline=BORDER_GLOW, width=2)
        draw.text((820, 508), "🛡️ Sign-Off & Issue Brand Seal", font=f_h1, fill=(10, 20, 26))

        render_and_write(img, 1)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 6: STAGE 06 - CRYPTOGRAPHIC SEAL & AUDIT LEDGER (5 SECONDS)
    # ══════════════════════════════════════════════════════════════════
    for t in range(fps * 5):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        draw_top_nav(draw, "Stage 06")
        
        # Center Audit Certificate Modal
        draw.rectangle([(160, 90), (1120, 660)], fill=BG_PANEL, outline=MINT, width=2)
        
        draw.rectangle([(160, 90), (1120, 150)], fill=(15, 35, 25), outline=MINT, width=1)
        draw.text((200, 108), "✅ OFFICIAL BRAND COMPLIANCE CERTIFICATE ISSUED", font=f_h1, fill=MINT)
        
        # Details Grid
        draw.text((200, 180), "ASSET TITLE:", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((360, 180), "CarePlus Diwali Festive Campaign (Social Copy & Banner)", font=f_body_bold, fill=TEXT_WHITE)

        draw.text((200, 220), "COMPLIANCE SCORE:", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((360, 220), "100 / 100 • 100% Brand Compliant (All 3 issues resolved)", font=f_body_bold, fill=MINT)

        draw.text((200, 260), "AUTHOR / CREATOR:", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((360, 260), "Priyansh Vaghela (creator@brandguard.ai)", font=f_body, fill=TEXT_WHITE)

        draw.text((200, 300), "APPROVED BY:", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((360, 300), "Aarav Mehta (Brand Manager, CarePlus Health)", font=f_body, fill=TEXT_WHITE)

        draw.text((200, 340), "TIMESTAMP:", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((360, 340), "29-Oct-2026 02:18:00 UTC", font=f_body, fill=TEXT_WHITE)

        draw.text((200, 380), "CRYPTOGRAPHIC SEAL:", font=f_small_bold, fill=TEXT_MUTED)
        draw.text((360, 380), "SHA256: 7f8a91b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6...", font=f_mono, fill=MINT)

        # Permanent Ledger Box
        draw.rectangle([(200, 420), (1080, 560)], fill=(10, 18, 25), outline=BORDER, width=1)
        draw.text((220, 435), "IMMUTABLE AUDIT LOG RECORD #BG-9420-CAREPLUS", font=f_small_bold, fill=BLUE)
        draw.text((220, 465), "• Engine 1: Python Regex scanned 145 patterns (R1, R2, R4) -> Verified.", font=f_small, fill=TEXT_MUTED)
        draw.text((220, 490), "• Engine 2: Gemini 1.5 Flash validated tone & generated intent-preserving rewrites.", font=f_small, fill=TEXT_MUTED)
        draw.text((220, 515), "• Evidence Verifier: 100% quote match rate, zero hallucinated citations dropped.", font=f_small, fill=TEXT_MUTED)
        draw.text((220, 535), "• Human Sign-Off: Certified for multi-channel public broadcasting.", font=f_small_bold, fill=MINT)

        # Status Pill
        draw.rectangle([(480, 585), (800, 635)], fill=MINT)
        draw.text((505, 598), "CLEARED TO PUBLISH ✓", font=f_h1, fill=(10, 20, 26))

        render_and_write(img, 1)

    # ══════════════════════════════════════════════════════════════════
    # SCENE 7: SUMMARY & OUTRO (4 SECONDS)
    # ══════════════════════════════════════════════════════════════════
    for t in range(fps * 4):
        img = Image.new("RGB", (width, height), BG_DARK)
        draw = ImageDraw.Draw(img)
        
        # Center Card
        draw.rectangle([(240, 160), (1040, 560)], fill=BG_PANEL, outline=BORDER_GLOW, width=2)
        
        draw.text((450, 210), "BrandGuard", font=ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 46), fill=TEXT_WHITE)
        draw.text((370, 280), "Pre-Publication Brand Review & Governance Platform", font=f_h2, fill=BLUE)
        
        draw.text((310, 340), "✓ Full Core Workflow Functional from Ingestion to Sign-Off", font=f_body_bold, fill=MINT)
        draw.text((310, 375), "✓ Dual-Engine: Deterministic Python Rules + Gemini Contextual AI", font=f_body, fill=TEXT_WHITE)
        draw.text((310, 410), "✓ Zero Hallucinations via Strict Evidence Verifier Guardrail", font=f_body, fill=TEXT_WHITE)
        draw.text((310, 445), "✓ Mathematical CIELAB Delta-E & WCAG AA Contrast Verification", font=f_body, fill=TEXT_WHITE)
        
        draw.text((430, 505), "Ready for Round 2 Hackathon Evaluation 🚀", font=f_body_bold, fill=AMBER)

        render_and_write(img, 1)

    out.release()
    print(f"SUCCESS: Video successfully generated at: {output_filename}")
    return output_filename

if __name__ == "__main__":
    create_demo_video()
