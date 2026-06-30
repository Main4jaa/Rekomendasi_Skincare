from fastapi import APIRouter, Query

from app.services.recommendation_service import RecommendationRequest, get_recommendation_service

router = APIRouter(prefix='/api/skincare', tags=['skincare'])


@router.get('/health')
def health():
    service = get_recommendation_service()
    return {
        'status': 'ok',
        'products_count': len(service.products),
        'selected_model': service.best_model_name,
    }


@router.get('/active-ingredients')
def active_ingredients():
    items = get_recommendation_service().get_active_ingredients()
    return {'items': items, 'active_ingredients': items}


@router.get('/products')
def products(
    active_ingredient: str | None = None,
    search: str | None = None,
    category: str | None = None,
    limit: int = Query(100, ge=1, le=200),
):
    items = get_recommendation_service().list_products(
        active_ingredient=active_ingredient,
        search=search,
        category=category,
        limit=limit,
    )
    return {'items': items, 'products': items, 'total': len(items)}


@router.get('/recommend')
def recommend(
    active_ingredient: str,
    diagnosis: str | None = None,
    skin_type: str | None = None,
    prefer_halal: bool = False,
    prefer_fragrance_free: bool = False,
    top_n: int = Query(3, ge=1, le=20),
):
    request = RecommendationRequest(
        active_ingredient=active_ingredient,
        diagnosis=diagnosis,
        skin_type=skin_type,
        prefer_halal=prefer_halal,
        prefer_fragrance_free=prefer_fragrance_free,
        top_n=top_n,
    )
    return get_recommendation_service().recommend(request, auto_select_model=True)
