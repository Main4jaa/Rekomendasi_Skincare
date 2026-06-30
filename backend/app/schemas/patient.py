from pydantic import BaseModel, Field
from typing import Optional
class PatientCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    age: Optional[int] = Field(default=None, ge=0, le=120)
    gender: Optional[str] = None
class PatientUpdate(BaseModel):
    name: Optional[str] = Field(default=None, max_length=120)
    age: Optional[int] = Field(default=None, ge=0, le=120)
    gender: Optional[str] = None
