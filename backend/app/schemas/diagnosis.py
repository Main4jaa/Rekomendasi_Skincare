from pydantic import BaseModel, Field
from typing import Any, Optional
class PredictRequest(BaseModel):
    symptoms: list[str] = Field(..., min_length=1)
    age: int | None = Field(default=0, ge=0, le=120)
    patient_id: Optional[str] = None
class DiagnosisSave(BaseModel):
    patient_id: Optional[str] = None
    patient_name: Optional[str] = None
    symptoms: list[str]
    expert_diagnosis: Optional[str] = None
    expert_treatment: Optional[str] = None
    expert_cf: Optional[float] = None
    ml_diagnosis: Optional[str] = None
    ml_confidence: Optional[float] = None
    ml_probabilities: dict[str, float] | dict[str, Any] | None = None
    final_diagnosis: str
    final_treatment: Optional[str] = None
    confidence_score: float
