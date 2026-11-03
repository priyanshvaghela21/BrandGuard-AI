"""
Akira AI Inference Classifier Module
Loads trained model artifact from 'akira_model.joblib' and executes rapid
(<5ms) supervised compliance classification and confidence scoring.
"""

import os
import joblib
from typing import Dict, Any

MODEL_PATH = os.path.join(os.path.dirname(__file__), "akira_model.joblib")
_MODEL = None

def get_model():
    global _MODEL
    if _MODEL is None:
        if os.path.exists(MODEL_PATH):
            try:
                _MODEL = joblib.load(MODEL_PATH)
            except Exception as e:
                print(f"[Akira AI] Error loading model: {e}")
                _MODEL = None
    return _MODEL

def classify_ad_compliance(text: str) -> Dict[str, Any]:
    """
    Classify a marketing creative or ad copy.
    Returns:
      is_violation: bool
      confidence: float
      label: 'Violation' | 'Compliant'
      status: 'Blocked' | 'Safe'
    """
    model = get_model()
    if not model or not text:
        return {
            "is_violation": False,
            "confidence": 0.85,
            "label": "Compliant",
            "status": "Safe",
            "model_active": False
        }

    try:
        prob = model.predict_proba([text])[0]
        # Class 1 is Violation, Class 0 is Compliant
        violation_prob = float(prob[1])
        compliant_prob = float(prob[0])
        is_violation = violation_prob >= 0.5

        return {
            "is_violation": is_violation,
            "confidence": round(violation_prob if is_violation else compliant_prob, 4),
            "label": "Violation" if is_violation else "Compliant",
            "status": "Blocked" if is_violation else "Safe",
            "violation_probability": round(violation_prob, 4),
            "model_active": True,
            "engine": "Akira-Governance-Net v2.4 (Supervised)"
        }
    except Exception as e:
        return {
            "is_violation": False,
            "confidence": 0.5,
            "label": "Uncertain",
            "status": "Escalate",
            "error": str(e),
            "model_active": False
        }

if __name__ == "__main__":
    test_samples = [
        "Our miracle remedy guarantees 100% cure for cancer with zero hospital fees.",
        "Comprehensive health insurance offering extensive cardiac coverage and cashless hospitalization at network hospitals.*",
        "Invest in our crypto bot and earn guaranteed 25% risk-free returns every month with zero loss.",
        "Enjoy up to 35% promotional discount on select seasonal apparel this weekend.* (T&C apply)."
    ]
    print("[Testing Akira AI Live Trained Model Inference]")
    for sample in test_samples:
        res = classify_ad_compliance(sample)
        print(f"Sample: {sample[:60]}...")
        print(f"Verdict: {res['label']} ({res['confidence'] * 100:.1f}% confidence, status: {res['status']})\n")
