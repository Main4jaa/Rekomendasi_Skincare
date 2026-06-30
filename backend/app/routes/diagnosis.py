import json
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, HTTPException, Query

from app.schemas.diagnosis import PredictRequest, DiagnosisSave
from app.services.diagnosis_service import DiagnosisService
from app.services.recommendation_service import get_recommendation_service

router = APIRouter(prefix='/api/diagnosis', tags=['diagnosis'])
service = DiagnosisService()

DATA_DIR = Path(__file__).resolve().parents[1] / 'data'
HISTORY_FILE = DATA_DIR / 'diagnosis_history.json'


def _read_history() -> list[dict]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text('[]', encoding='utf-8')
        return []
    try:
        return json.loads(HISTORY_FILE.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        return []


def _write_history(rows: list[dict]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    HISTORY_FILE.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding='utf-8')


@router.post('/predict')
def predict(payload: PredictRequest):
    return service.predict(payload.symptoms, payload.age)


def _usable_treatment(value: str | None) -> str | None:
    if not value:
        return None
    text = str(value).strip()
    if not text or text.lower().startswith('konsultasi'):
        return None
    return text


@router.post('/predict-with-recommendations')
def predict_with_recommendations(
    payload: PredictRequest,
    skin_type: str | None = None,
    budget_max: int | None = None,
    prefer_halal: bool = False,
    prefer_fragrance_free: bool = False,
    top_n: int = Query(5, ge=1, le=20),
):
    diagnosis_result = service.predict(payload.symptoms, payload.age)
    integrated = diagnosis_result.get('integrated', {}) or {}
    expert = diagnosis_result.get('expert_system', {}) or {}
    partial = diagnosis_result.get('partial_rule', {}) or {}

    # Ambil zat aktif terbaik: integrated -> expert rule lengkap -> partial rule terdekat.
    # Ini mencegah rekomendasi kosong saat gejala belum lengkap memenuhi satu rule penuh.
    treatment = (
        _usable_treatment(integrated.get('treatment'))
        or _usable_treatment(expert.get('treatment'))
        or _usable_treatment(partial.get('treatment'))
        or 'Asam Salisilat'
    )
    diagnosis_name = integrated.get('diagnosis') or expert.get('diagnosis') or partial.get('diagnosis') or 'Rekomendasi Umum'

    try:
        recommendations = get_recommendation_service().recommend_from_diagnosis(
            diagnosis=diagnosis_name,
            active_ingredient=treatment,
            confidence_score=integrated.get('confidence_score'),
            skin_type=skin_type,
            budget_max=budget_max,
            prefer_halal=prefer_halal,
            prefer_fragrance_free=prefer_fragrance_free,
            top_n=top_n,
        )
    except Exception as exc:
        # Jangan biarkan endpoint diagnosis gagal hanya karena modul rekomendasi error.
        # Tetap tampilkan 3 produk umum berbasis Asam Salisilat agar frontend tidak kosong.
        fallback_active = treatment or 'Asam Salisilat'
        rec_service = get_recommendation_service()
        from app.services.recommendation_service import RecommendationRequest
        fallback_request = RecommendationRequest(
            active_ingredient=fallback_active,
            diagnosis=diagnosis_name,
            confidence_score=integrated.get('confidence_score'),
            skin_type=skin_type,
            budget_max=None,
            prefer_halal=prefer_halal,
            prefer_fragrance_free=prefer_fragrance_free,
            top_n=top_n,
        )
        fallback_recommendation = rec_service.recommend(fallback_request, auto_select_model=True)
        recommendations = {
            'diagnosis_result': {
                'diagnosis': diagnosis_name,
                'active_ingredient': fallback_active,
                'confidence_score': integrated.get('confidence_score'),
            },
            'recommendation_result': fallback_recommendation,
            'warning': f'Rekomendasi memakai fallback karena terjadi error: {exc}',
        }

    return {
        'diagnosis': diagnosis_result,
        'skincare_recommendations': recommendations,
    }


@router.post('/save')
def save(payload: DiagnosisSave):
    try:
        rows = _read_history()
        item = payload.model_dump()
        item['id'] = str(uuid4())
        item['created_at'] = datetime.now().isoformat(timespec='seconds')
        rows.insert(0, item)
        _write_history(rows)
        return item
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f'Gagal menyimpan riwayat lokal: {exc}')


@router.get('/history')
def history(
    patient_id: str | None = None,
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = None,
    start_date: str | None = None,
    end_date: str | None = None,
):
    rows = _read_history()

    if patient_id:
        rows = [row for row in rows if row.get('patient_id') == patient_id]
    if search:
        query = search.lower()
        rows = [row for row in rows if query in str(row.get('patient_name', '')).lower()]
    if start_date:
        rows = [row for row in rows if str(row.get('created_at', ''))[:10] >= start_date]
    if end_date:
        rows = [row for row in rows if str(row.get('created_at', ''))[:10] <= end_date]

    total = len(rows)
    items = rows[offset: offset + limit]
    return {'items': items, 'total': total, 'limit': limit, 'offset': offset}


@router.get('/history/{patient_id}')
def history_by_patient(patient_id: str, limit: int = 10, offset: int = 0):
    return history(patient_id=patient_id, limit=limit, offset=offset)


@router.get('/stats')
def stats():
    rows = _read_history()
    total = len(rows)
    average_confidence = round(
        sum(float(row.get('confidence_score') or 0) for row in rows) / total,
        4,
    ) if total else 0

    distribution: dict[str, int] = {}
    for row in rows:
        diagnosis = row.get('final_diagnosis') or 'Unknown'
        distribution[diagnosis] = distribution.get(diagnosis, 0) + 1

    top_diagnosis = max(distribution, key=distribution.get) if distribution else '-'
    return {
        'total': total,
        'average_confidence': average_confidence,
        'top_diagnosis': top_diagnosis,
        'distribution': distribution,
    }
