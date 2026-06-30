from fastapi import APIRouter, HTTPException, Query

from app.schemas.recommendation import RecommendationFromDiagnosisSchema, RecommendationRequestSchema
from app.services.recommendation_service import RecommendationRequest, get_recommendation_service

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("/health")
def health():
    service = get_recommendation_service()
    return {
        "status": "ok",
        "products_count": len(service.products),
        "selected_model": service.best_model_name,
        "available_models": ["rule_based", "content_based", "hybrid"],
    }


@router.get("/active-ingredients")
def active_ingredients():
    return {"items": get_recommendation_service().get_active_ingredients()}


@router.get("/products")
def products(active_ingredient: str | None = None, limit: int = Query(50, ge=1, le=200)):
    return {"items": get_recommendation_service().list_products(active_ingredient=active_ingredient, limit=limit)}


@router.post("/by-active")
def recommend_by_active(payload: RecommendationRequestSchema):
    try:
        request = RecommendationRequest(
            active_ingredient=payload.active_ingredient,
            diagnosis=payload.diagnosis,
            confidence_score=payload.confidence_score,
            skin_type=payload.skin_type,
            budget_max=payload.budget_max,
            prefer_halal=payload.prefer_halal,
            prefer_fragrance_free=payload.prefer_fragrance_free,
            top_n=payload.top_n,
        )
        return get_recommendation_service().recommend(request, auto_select_model=payload.auto_select_model)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/from-diagnosis")
def recommend_from_diagnosis(payload: RecommendationFromDiagnosisSchema):
    try:
        return get_recommendation_service().recommend_from_diagnosis(
            diagnosis=payload.diagnosis,
            active_ingredient=payload.active_ingredient,
            confidence_score=payload.confidence_score,
            skin_type=payload.skin_type,
            budget_max=payload.budget_max,
            prefer_halal=payload.prefer_halal,
            prefer_fragrance_free=payload.prefer_fragrance_free,
            top_n=payload.top_n,
            auto_select_model=payload.auto_select_model,
        )
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc))
