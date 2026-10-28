from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class InkloomGenerateRequest(BaseModel):
    brand_name: str
    industry: Optional[str] = "Healthcare & Life Sciences"
    style_preference: Optional[str] = "Modern Minimalist"
    prompt_keywords: Optional[str] = "trust, clinical precision, organic, medical care"
    workspace: Optional[str] = "CarePlus Health"

class ColorSwatch(BaseModel):
    name: str
    hex: str
    cielab_l: float
    cielab_a: float
    cielab_b: float
    contrast_ratio: str
    wcag_pass: bool

class InkloomAssetResponse(BaseModel):
    asset_id: str
    brand_name: str
    tagline: str
    draft_copy: str
    logo_svg: str
    palette: List[ColorSwatch]
    credits_deducted: float
    credits_remaining: float
    member_email: str
    provider: str
    status: str
    compliance_preview: Dict[str, Any]
    generated_at: str

class InkloomCreditsResponse(BaseModel):
    total_credits: float
    used_credits: float
    available_credits: float
    member_email: str
    membership_status: str
    promo_code: str
    logo_generation_status: str
