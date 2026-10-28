import re
from typing import List, Dict, Any
from app.schemas.review import IssueSchema

class RuleEngine:
    """High-performance Deterministic Brand Governance Rule Engine (Python + Regex)"""

    @classmethod
    def evaluate(cls, text: str, custom_rules: str = None) -> Dict[str, Any]:
        """
        Evaluate marketing copy against brand governance rules.
        Returns compliance score and list of detected IssueSchema objects.
        """
        if not text:
            return {"score": 100, "issues": []}

        issues: List[IssueSchema] = []
        text_lower = text.lower()

        # ── RULE 1: Unsupported Medical & Permanent Cure Guarantees ──
        r1_patterns = [
            (r"\bpermanently cures?\b", "permanently cures"),
            (r"\bcure all acne overnight\b", "cure all acne overnight"),
            (r"\bguarantees?\s+(?:100%|results?|cure)\b", "guarantees 100%"),
            (r"\b100%\s+cure\b", "100% cure"),
            (r"\bcure\s+(?:cancer|acne|diabetes|disease)\b", "cure disease"),
            (r"\bovernight in just \d+ hours\b", "overnight in just 8 hours"),
            (r"\bmiraculous (?:results|cure)\b", "miraculous results")
        ]
        for pattern, default_quote in r1_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                quote = match.group(0)
                issues.append(
                    IssueSchema(
                        id="R1",
                        severity="High",
                        type="Unsupported medical guarantee",
                        quote=quote,
                        explanation="Do not claim overnight or permanent cure without clinical double-blind certification under medical advertising standards.",
                        rewrite="visibly clears blemishes and supports balanced skin renewal with daily dermatological use",
                        state="open",
                        verified=True
                    )
                )
                break

        # ── RULE 2: Prohibited Phrases ("Zero Chemicals") & Terminology ("User") ──
        if "100% organic with zero chemicals" in text_lower or "zero chemicals" in text_lower:
            match = re.search(r"100% organic with zero chemicals|zero chemicals", text, re.IGNORECASE)
            quote = match.group(0) if match else "100% organic with zero chemicals"
            issues.append(
                IssueSchema(
                    id="R2",
                    severity="High",
                    type="Prohibited absolute phrase",
                    quote=quote,
                    explanation="Prohibited term: Do not use '100% organic with zero chemicals' under consumer protection guidelines (water and botanical extracts are chemical compounds).",
                    rewrite="formulated with certified botanical extracts and gentle dermatologist-tested ingredients",
                    state="open",
                    verified=True
                )
            )
        elif re.search(r"\buser\b|\busers\b", text, re.IGNORECASE):
            match = re.search(r"\buser\b|\busers\b", text, re.IGNORECASE)
            quote = match.group(0) if match else "user"
            issues.append(
                IssueSchema(
                    id="R2",
                    severity="Low",
                    type="Terminology nomenclature",
                    quote=quote,
                    explanation="Brand nomenclature mandates referring to customers as 'customer', 'patient', or 'member', not technical jargon 'user'.",
                    rewrite="customer",
                    state="open",
                    verified=True
                )
            )

        # ── RULE 3: Maximum Allowed Promotional Discount (Max 40% OFF) ──
        discount_match = re.search(r"\b([5-9]\d%|100%)\s*(?:off|discount)\b", text, re.IGNORECASE)
        if discount_match:
            quote = discount_match.group(0)
            issues.append(
                IssueSchema(
                    id="R3",
                    severity="Medium",
                    type="Discount policy violation",
                    quote=quote,
                    explanation="Maximum promotional discount allowed under brand guidelines is 40% OFF. Higher discounts devalue brand positioning.",
                    rewrite="up to 40% OFF for this festive season",
                    state="open",
                    verified=True
                )
            )

        # ── RULE 4: Free/Zero Fees without Mandatory Asterisk Disclaimer ──
        zero_fee_match = re.search(r"\b(zero fees?|free treatment)\b(?!\s*\*|\s*\(with)", text, re.IGNORECASE)
        if zero_fee_match:
            quote = zero_fee_match.group(0)
            issues.append(
                IssueSchema(
                    id="R4",
                    severity="High",
                    type="Missing mandatory disclaimer",
                    quote=quote,
                    explanation="Promotional claims of 'zero fees' or 'free treatment' must include an asterisk (*) referencing eligibility conditions.",
                    rewrite=f"{quote} on eligible plans*",
                    state="open",
                    verified=True
                )
            )

        # ── Optional: Custom Rules Evaluation if provided by user ──
        if custom_rules:
            # Check for forbidden keywords mentioned in custom rules
            forbidden_words = re.findall(r"\bno\s+([a-zA-Z0-9]+)\b|\bavoid\s+([a-zA-Z0-9]+)\b", custom_rules, re.IGNORECASE)
            for pairs in forbidden_words:
                target_word = pairs[0] or pairs[1]
                if target_word and len(target_word) > 2 and re.search(rf"\b{re.escape(target_word)}\b", text, re.IGNORECASE):
                    issues.append(
                        IssueSchema(
                            id="CUSTOM-1",
                            severity="Medium",
                            type="Custom rule violation",
                            quote=target_word,
                            explanation=f"Custom workspace rule explicitly prohibits the term '{target_word}'.",
                            rewrite="Follow approved brand terminology guidelines",
                            state="open",
                            verified=True
                        )
                    )

        # Calculate Compliance Score (0 to 100%)
        deductions = sum(
            25 if issue.severity == "High" else 15 if issue.severity == "Medium" else 8
            for issue in issues
        )
        score = max(25, 100 - deductions)

        # ── Classify Content Risk Level (High Risk, Moderate Risk, Normal Risk, Safe) ──
        has_high_severity = any(i.severity == "High" for i in issues)
        has_medium_severity = any(i.severity == "Medium" for i in issues)

        if len(issues) == 0 or score >= 95:
            risk_level = "Safe"
            risk_color = "#10b981"
            risk_summary = "Zero critical or regulatory violations. Content is safe and compliant for publishing."
        elif score < 50 or has_high_severity:
            risk_level = "High Risk"
            risk_color = "#ef4444"
            risk_summary = "Critical regulatory or brand compliance violations detected. Severe legal, FTC, or medical penalty risk."
        elif score < 80 or has_medium_severity:
            risk_level = "Moderate Risk"
            risk_color = "#f59e0b"
            risk_summary = "Moderate policy deviations detected (e.g. promotional caps or disclaimer omissions). Requires human review."
        else:
            risk_level = "Normal Risk"
            risk_color = "#3b82f6"
            risk_summary = "Minor stylistic or terminology adjustments. Safe with minor editorial polish."

        return {
            "score": score,
            "issues": issues,
            "open_issues_count": len(issues),
            "risk_level": risk_level,
            "risk_color": risk_color,
            "risk_summary": risk_summary
        }
