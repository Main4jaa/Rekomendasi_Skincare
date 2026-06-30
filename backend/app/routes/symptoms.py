from fastapi import APIRouter
from app.core_constants import SYMPTOMS, RULES
router = APIRouter(prefix='/api/symptoms', tags=['symptoms'])
@router.get('')
def list_symptoms(): return SYMPTOMS
@router.get('/rules')
def list_rules(): return RULES
