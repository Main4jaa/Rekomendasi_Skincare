from pydantic import BaseModel, Field
from typing import Optional


class RecommendationRequestSchema(BaseModel):
    active_ingredient: str = Field(..., description="Zat aktif hasil diagnosis, misalnya Asam Salisilat")
    diagnosis: Optional[str] = None
    confidence_score: Optional[float] = None
    skin_type: Optional[str] = None
    budget_max: Optional[int] = Field(default=None, ge=0)
    prefer_halal: bool = False
    prefer_fragrance_free: bool = False
    top_n: int = Field(default=5, ge=1, le=20)
    auto_select_model: bool = True


class RecommendationFromDiagnosisSchema(BaseModel):
    diagnosis: str
    active_ingredient: Optional[str] = None
    confidence_score: Optional[float] = None
    skin_type: Optional[str] = None
    budget_max: Optional[int] = Field(default=None, ge=0)
    prefer_halal: bool = False
    prefer_fragrance_free: bool = False
    top_n: int = Field(default=5, ge=1, le=20)
    auto_select_model: bool = True
