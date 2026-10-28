import re
from typing import Dict, Any, List
from app.schemas.review import IssueSchema

class AIRoutingEngine:
    """
    Autonomous Content Governance & Moderation Routing Engine
    Follows Akira AI 4-Stage Moderation Architecture:
    1. Incoming User Content
    2. AI Filtering (Spam, Malicious patterns, Blacklisted words)
    3. AI Tagging & Analysis (Toxicity, Sentiment, Context)
    4. AI Routing Decision Engine:
       -> Auto-Resolve -> Content Approved (Limited)
       -> Reject       -> Content Rejected
       -> Escalate     -> Human Moderator Review -> Approved / Rejected
    """

    @classmethod
    def filter_content(cls, text: str) -> Dict[str, Any]:
        """Stage 2: AI Filtering for Spam, Malicious claims, and Blacklisted patterns."""
        flags: List[str] = []
        is_spam = False
        is_malicious = False

        text_lower = text.lower()

        # Check spam / link injection patterns
        if re.search(r"https?://(?:bit\.ly|tinyurl\.com|t\.co|t\.me|wa\.me)/", text, re.IGNORECASE):
            flags.append("Suspicious redirect / Shortlink injection")
            is_spam = True

        # Check blacklisted zero-chemical & guarantee scams
        if "100% organic with zero chemicals" in text_lower or "zero chemicals" in text_lower:
            flags.append("Prohibited 'Zero Chemicals' blacklisted phrase")

        # Check overt cure scams (fatal malicious medical marketing)
        if re.search(r"\b(?:100% cure for cancer|miraculous cancer cure|guaranteed cure for terminal)\b", text, re.IGNORECASE):
            flags.append("Critical: Unverified fatal cure guarantee")
            is_malicious = True

        filter_passed = not is_spam and not is_malicious
        return {
            "passed": filter_passed,
            "is_spam": is_spam,
            "is_malicious": is_malicious,
            "filter_flags": flags,
            "filter_status": "Clean" if filter_passed else "Flagged"
        }

    @classmethod
    def tag_and_analyze(cls, text: str, brand_name: str = "") -> Dict[str, Any]:
        """Stage 3: AI Tagging & Analysis (Toxicity, Sentiment, Domain Context)."""
        text_lower = text.lower()

        # Toxicity scoring (0 = toxic, 100 = completely brand safe)
        toxicity_score = 99
        toxic_triggers = ["cure all acne overnight", "guarantees 100%", "miraculous", "permanently cure"]
        for trigger in toxic_triggers:
            if trigger in text_lower:
                toxicity_score -= 25
        toxicity_score = max(20, toxicity_score)

        # Sentiment Analysis
        if any(w in text_lower for w in ["guarantee", "miraculous", "overnight", "exclusive"]):
            sentiment = "High-Pressure Promotional / Aggressive"
        elif any(w in text_lower for w in ["patient", "clinical", "dermatological", "renewal", "balanced"]):
            sentiment = "Clinical, Empathetic & Compliant"
        else:
            sentiment = "Informative & Promotional"

        # Context Tagging
        context_tags: List[str] = ["[Brand Marketing]"]
        if any(w in text_lower for w in ["cure", "therapy", "patient", "clinical", "disease", "treatment"]):
            context_tags.extend(["[FDA 21 CFR 312]", "[Medical Advertising]", "[Patient-Centricity]"])
        if any(w in text_lower for w in ["discount", "free", "zero fees", "off"]):
            context_tags.extend(["[FTC Pricing Transparency]", "[Required Disclaimers]"])
        if any(w in text_lower for w in ["skin", "organic", "blemish", "derma"]):
            context_tags.append("[Cosmetic Efficacy Guidelines]")

        return {
            "toxicity_score": f"{toxicity_score}% Brand Safe",
            "toxicity_raw": toxicity_score,
            "sentiment": sentiment,
            "context_tags": context_tags
        }

    @classmethod
    def decide_route(
        cls,
        filter_res: Dict[str, Any],
        tag_res: Dict[str, Any],
        compliance_score: int,
        issues: List[IssueSchema]
    ) -> Dict[str, Any]:
        """
        Stage 4: AI Routing Decision Engine
        Routes to:
        - Auto-Resolve -> Content Approved (Limited)
        - Reject       -> Content Rejected
        - Escalate     -> Human Moderator Review
        """
        has_high_severity = any(i.severity == "High" for i in issues)
        is_malicious = filter_res.get("is_malicious", False)
        is_spam = filter_res.get("is_spam", False)

        # Route 1: Reject (Fatal violations, extreme false cure promises, or spam)
        if is_malicious or is_spam or compliance_score < 45:
            return {
                "route": "Reject",
                "route_label": "Direct Reject",
                "target_status": "Rejected",
                "tone": "rose",
                "action": "Immediate AI Disqualification: Violated Truth-in-Advertising medical guarantee regulations.",
                "explanation": "Content exceeds allowable risk threshold for corporate brand governance.",
                "requires_moderator": False
            }

        # Route 2: Auto-Resolve (Score >= 80, only minor warnings e.g. R4 asterisk or terminology)
        if compliance_score >= 80 and not has_high_severity:
            return {
                "route": "Auto-Resolve",
                "route_label": "AI Auto-Resolve Action",
                "target_status": "Content Approved (Limited)",
                "tone": "green",
                "action": "Appended mandatory statutory disclaimer (*) & normalized patient terminology.",
                "explanation": "Minor compliance notes auto-resolved by AI rule engine without requiring human escalation.",
                "requires_moderator": False
            }

        # Route 3: Escalate (High/Medium severity, borderline statements, or compliance score 45-79)
        return {
            "route": "Escalate",
            "route_label": "Escalate to Human Moderator",
            "target_status": "Pending", # Queued for Human Moderator Review
            "tone": "amber",
            "action": "Queued into Admin Governance Pipeline for Human Moderator Review.",
            "explanation": "Contains sensitive medical claims or high-severity compliance warnings requiring human sign-off.",
            "requires_moderator": True
        }

    @classmethod
    def evaluate(
        cls,
        text: str,
        brand_name: str = "",
        compliance_score: int = 80,
        issues: List[Any] = None
    ) -> Dict[str, Any]:
        """Convenience method executing the complete Akira 4-stage pipeline."""
        filter_res = cls.filter_content(text)
        tag_res = cls.tag_and_analyze(text, brand_name)
        route_res = cls.decide_route(filter_res, tag_res, compliance_score, issues or [])
        return {
            "pipeline_stage": "AI Routing (Decision Engine)",
            "filter_results": filter_res,
            "tag_results": tag_res,
            "route_decision": route_res["route"],
            "route_label": route_res["route_label"],
            "target_status": route_res["target_status"],
            "route_action": route_res["action"],
            "requires_moderator": route_res["requires_moderator"],
            "toxicity_score": tag_res["toxicity_score"],
            "sentiment": tag_res["sentiment"],
            "context_tags": tag_res["context_tags"]
        }
