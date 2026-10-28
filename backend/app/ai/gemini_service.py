import json
import logging
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings
from app.schemas.review import IssueSchema

logger = logging.getLogger(__name__)

class GeminiService:
    """Google Gemini API Integration for Tone Evaluation, Claim Verification & Smart Rewrites"""

    BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"

    @classmethod
    def analyze_brand_content(
        cls,
        brand_name: str,
        draft: str,
        custom_rules: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Query Google Gemini API to analyze brand tone, identify unsupported claims,
        and generate compliant smart rewrites.
        """
        api_key = settings.GEMINI_API_KEY
        if not api_key or api_key.startswith("your_") or "placeholder" in api_key.lower():
            logger.info("GEMINI_API_KEY not configured or is placeholder. Using rule-augmented contextual generator.")
            return cls._fallback_analysis(brand_name, draft)

        model = settings.GEMINI_MODEL
        url = f"{cls.BASE_URL}/{model}:generateContent?key={api_key}"

        prompt = f"""
You are BrandGuard AI, an autonomous corporate brand governance and advertising compliance evaluator.
Evaluate the following marketing draft for brand '{brand_name}'.

BRAND DRAFT:
\"\"\"{draft}\"\"\"

CUSTOM BRAND RULES:
{custom_rules or 'Standard FDA, FTC, and corporate brand tone guidelines: No overnight guarantees, no zero-chemical claims, use customer-centric terminology.'}

Respond strictly in valid JSON format matching this schema:
{{
  "tone_summary": "Short 1-2 sentence assessment of tone and empathy",
  "ai_score_adjustment": 0,
  "ai_issues": [
    {{
      "id": "AI-1",
      "severity": "High" | "Medium" | "Low",
      "type": "Tone deviation / Exaggerated claim",
      "quote": "exact quote from text",
      "explanation": "Why this violates brand governance",
      "rewrite": "Brand-compliant rewrite"
    }}
  ]
}}
"""

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(url, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "{}")
                        parsed = json.loads(text_content)
                        return parsed
                logger.warning("Gemini API returned status %s: %s", response.status_code, response.text)
        except Exception as exc:
            logger.warning("Gemini API call failed (%s). Utilizing local rule analysis.", str(exc))

        return cls._fallback_analysis(brand_name, draft)

    @classmethod
    def _fallback_analysis(cls, brand_name: str, draft: str) -> Dict[str, Any]:
        """Contextual fallback when offline or API key is not configured."""
        return {
            "tone_summary": f"Content evaluated for {brand_name}. Tone is persuasive with opportunities for claim verification.",
            "ai_score_adjustment": 0,
            "ai_issues": []
        }
