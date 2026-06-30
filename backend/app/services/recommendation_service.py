from __future__ import annotations

import json
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any, Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parents[1]
DATA_DIR = BASE_DIR / "data"
OUTPUT_DIR = BASE_DIR / "outputs"
PRODUCTS_CSV = DATA_DIR / "products.csv"
VECTORIZER_PATH = OUTPUT_DIR / "tfidf_vectorizer.pkl"
PRODUCT_VECTORS_PATH = OUTPUT_DIR / "product_vectors.npy"
RECOMMENDATION_MODEL_PATH = OUTPUT_DIR / "recommendation_model.pkl"
PRODUCT_MAPPING_PATH = OUTPUT_DIR / "product_mapping.pkl"

DIAGNOSIS_TO_ACTIVE = {
    "Whitehead": "Asam Laktat",
    "Blackhead": "Asam Glikolat",
    "Pustule": "Benzoil Peroksida",
    "Papule": "Asam Salisilat",
    "Kulit Kusam": "Vitamin C",
    "Kulit Mengkilap Akibat Minyak Berlebih": "Asam Hialuronat",
    "Kulit Kendur": "Asam Hialuronat",
    "Kulit Kendur/Dehidrasi": "Asam Hialuronat",
    "Hiperpigmentasi": "Alpha Arbutin",
    "Noda Hitam Hiperpigmentasi": "Alpha Arbutin",
    "Unknown": "Asam Salisilat",
    "Rekomendasi Umum": "Asam Salisilat",
}

ACTIVE_TO_CONCERN = {
    "Asam Laktat": ["Whitehead", "Kulit Kusam", "Tekstur Kasar"],
    "Asam Glikolat": ["Blackhead", "Kulit Kusam", "Tekstur Kasar"],
    "Benzoil Peroksida": ["Pustule", "Papule", "Jerawat Meradang"],
    "Asam Salisilat": ["Papule", "Blackhead", "Whitehead", "Pustule", "Pori Tersumbat"],
    "Vitamin C": ["Kulit Kusam", "Hiperpigmentasi", "Noda Hitam"],
    "Asam Hialuronat": ["Kulit Mengkilap Akibat Minyak Berlebih", "Kulit Kendur", "Kulit Kering", "Dehidrasi", "Hidrasi"],
    "Alpha Arbutin": ["Hiperpigmentasi", "Noda Hitam", "PIH"],
}


def _from_json_string(value: Any) -> Any:
    if isinstance(value, str) and value.startswith("["):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value
    return value


def _contains(values: list[Any], target: str) -> bool:
    target_lower = target.lower()
    return any(str(item).lower() == target_lower for item in values)


def _overlap(values: list[Any], targets: list[str]) -> int:
    values_lower = {str(item).lower() for item in values}
    return sum(1 for target in targets if target.lower() in values_lower)


def _safe_bool(value: Any) -> bool:
    if isinstance(value, str):
        return value.lower() in {"true", "1", "yes", "y"}
    return bool(value)


def _safe_str(value: Any) -> str:
    if value is None:
        return ""
    try:
        if pd.isna(value):
            return ""
    except Exception:
        pass
    return str(value)


def _contains_fuzzy(values: list[Any], target: str) -> bool:
    target_lower = str(target or "").strip().lower()
    if not target_lower:
        return True
    return any(target_lower in str(item).strip().lower() for item in values)


def _row_to_dict(row: pd.Series) -> dict[str, Any]:
    return {
        "product_id": str(row["product_id"]),
        "name": str(row["name"]),
        "brand": str(row["brand"]),
        "category": str(row["category"]),
        "active_ingredients": list(row["active_ingredients"]),
        "target_concerns": list(row["target_concerns"]),
        "price": int(row["price"]),
        "rating": float(row["rating"]),
        "reviews_count": int(row["reviews_count"]),
        "description": _safe_str(row["description"]),
        "image_url": _safe_str(row.get("image_url", "")),
        "product_url": _safe_str(row.get("product_url", "")),
        "is_halal": _safe_bool(row.get("is_halal", False)),
        "is_vegan": _safe_bool(row.get("is_vegan", False)),
        "skin_type": list(row["skin_type"]),
        "texture": _safe_str(row["texture"]),
        "fragrance": _safe_bool(row["fragrance"]),
    }


@dataclass
class RecommendationRequest:
    active_ingredient: str
    diagnosis: Optional[str] = None
    confidence_score: Optional[float] = None
    skin_type: Optional[str] = None
    budget_max: Optional[int] = None
    prefer_halal: bool = False
    prefer_fragrance_free: bool = False
    top_n: int = 5


class RecommendationService:
    """Service rekomendasi skincare untuk dipanggil dari FastAPI/backend."""

    def __init__(self):
        self.products = self._load_products()
        self.vectorizer, self.product_vectors = self._load_or_build_vectors()
        self.best_model_name = "hybrid"
        self._save_artifacts()

    def _load_products(self) -> pd.DataFrame:
        if not PRODUCTS_CSV.exists():
            raise FileNotFoundError(f"Database produk tidak ditemukan: {PRODUCTS_CSV}")
        df = pd.read_csv(PRODUCTS_CSV)
        for col in ["active_ingredients", "target_concerns", "skin_type"]:
            df[col] = df[col].apply(_from_json_string)
        return df

    def _product_texts(self, df: Optional[pd.DataFrame] = None) -> list[str]:
        data = self.products if df is None else df
        texts = []
        for _, row in data.iterrows():
            parts = [
                row["name"],
                row["brand"],
                row["category"],
                " ".join(row["active_ingredients"]),
                " ".join(row["target_concerns"]),
                " ".join(row["skin_type"]),
                row["texture"],
                row["description"],
            ]
            texts.append(" ".join(str(part) for part in parts))
        return texts

    def _load_or_build_vectors(self):
        try:
            if VECTORIZER_PATH.exists() and PRODUCT_VECTORS_PATH.exists():
                return joblib.load(VECTORIZER_PATH), np.load(PRODUCT_VECTORS_PATH)
        except Exception:
            pass
        vectorizer = TfidfVectorizer(lowercase=True, ngram_range=(1, 2))
        vectors = vectorizer.fit_transform(self._product_texts()).toarray()
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        joblib.dump(vectorizer, VECTORIZER_PATH)
        np.save(PRODUCT_VECTORS_PATH, vectors)
        return vectorizer, vectors

    def _save_artifacts(self):
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        mapping: dict[str, list[str]] = {}
        for _, row in self.products.iterrows():
            for ingredient in row["active_ingredients"]:
                mapping.setdefault(str(ingredient), []).append(str(row["product_id"]))
        joblib.dump(mapping, PRODUCT_MAPPING_PATH)
        joblib.dump({"selected_model": self.best_model_name, "available_models": ["rule_based", "content_based", "hybrid"]}, RECOMMENDATION_MODEL_PATH)

    def list_products(
        self,
        active_ingredient: Optional[str] = None,
        limit: int = 50,
        search: Optional[str] = None,
        category: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        df = self.products.copy()
        if active_ingredient:
            df = df[df["active_ingredients"].apply(lambda x: _contains_fuzzy(x, active_ingredient))]
        if category:
            category_lower = category.lower()
            df = df[df["category"].astype(str).str.lower().str.contains(category_lower, na=False)]
        if search:
            query = search.lower()
            def row_matches(row):
                text = " ".join([
                    _safe_str(row.get("name")),
                    _safe_str(row.get("brand")),
                    _safe_str(row.get("category")),
                    " ".join(map(str, row.get("active_ingredients", []))),
                    " ".join(map(str, row.get("target_concerns", []))),
                    _safe_str(row.get("description")),
                ]).lower()
                return query in text
            df = df[df.apply(row_matches, axis=1)]
        df = df.sort_values(["rating", "reviews_count"], ascending=[False, False])
        return [_row_to_dict(row) for _, row in df.head(limit).iterrows()]

    def get_active_ingredients(self) -> list[str]:
        ingredients = set()
        for values in self.products["active_ingredients"]:
            ingredients.update(str(item) for item in values)
        priority = list(dict.fromkeys(DIAGNOSIS_TO_ACTIVE.values()))
        rest = sorted(item for item in ingredients if item not in priority)
        return priority + rest

    def _apply_preferences(self, df: pd.DataFrame, request: RecommendationRequest) -> pd.DataFrame:
        df = df.copy()
        if request.budget_max is not None:
            df = df[df["price"] <= request.budget_max].copy()
        if request.skin_type:
            skin = request.skin_type.lower()
            df["skin_type_match"] = df["skin_type"].apply(lambda values: 1 if any(str(v).lower() == skin for v in values) else 0)
        else:
            df["skin_type_match"] = 0
        df["halal_bonus"] = df["is_halal"].apply(lambda x: 1 if _safe_bool(x) else 0) if request.prefer_halal else 0
        df["fragrance_free_bonus"] = df["fragrance"].apply(lambda x: 1 if not _safe_bool(x) else 0) if request.prefer_fragrance_free else 0
        return df

    def _format_results(self, df: pd.DataFrame, request: RecommendationRequest, model_name: str) -> list[dict[str, Any]]:
        results = []
        for rank, (_, row) in enumerate(df.head(request.top_n).iterrows(), start=1):
            item = _row_to_dict(row)
            item.update({
                "rank": rank,
                "score": round(float(row["recommendation_score"]), 4),
                "score_model": model_name,
                "match_reason": self._match_reason(row, request, model_name),
            })
            if "content_similarity" in row:
                item["content_similarity"] = round(float(row["content_similarity"]), 4)
            if "rule_score" in row:
                item["rule_score"] = round(float(row["rule_score"]), 4)
            if "content_score" in row:
                item["content_score"] = round(float(row["content_score"]), 4)
            results.append(item)
        return results

    def _match_reason(self, row: pd.Series, request: RecommendationRequest, model_name: str) -> str:
        reasons = []
        if _contains_fuzzy(row["active_ingredients"], request.active_ingredient):
            reasons.append(f"mengandung {request.active_ingredient}")
        if request.skin_type and int(row.get("skin_type_match", 0)) == 1:
            reasons.append(f"cocok untuk kulit {request.skin_type}")
        if request.prefer_halal and _safe_bool(row.get("is_halal", False)):
            reasons.append("halal")
        if request.prefer_fragrance_free and not _safe_bool(row.get("fragrance", True)):
            reasons.append("tanpa fragrance")
        if model_name == "content_based" and "content_similarity" in row:
            reasons.append(f"similarity konten {float(row['content_similarity']):.3f}")
        reasons.append(f"rating {float(row['rating'])} dari {int(row['reviews_count'])} ulasan")
        return ", ".join(reasons)

    def _rule_based(self, request: RecommendationRequest, top_n_multiplier: int = 1) -> list[dict[str, Any]]:
        df = self.products.copy()
        concerns = ACTIVE_TO_CONCERN.get(request.active_ingredient, [])
        df["active_match"] = df["active_ingredients"].apply(lambda x: 1 if _contains_fuzzy(x, request.active_ingredient) else 0)
        df["concern_overlap"] = df["target_concerns"].apply(lambda x: _overlap(x, concerns))
        candidates = df[df["active_match"] == 1].copy()
        if candidates.empty:
            candidates = df[df["concern_overlap"] > 0].copy()
        if candidates.empty:
            candidates = df.copy()
        candidates = self._apply_preferences(candidates, request)
        if candidates.empty:
            candidates = self._apply_preferences(df.copy(), RecommendationRequest(**{**request.__dict__, "budget_max": None}))
        min_price = float(candidates["price"].min())
        max_price = float(candidates["price"].max())
        max_reviews = float(candidates["reviews_count"].max()) or 1.0
        price_score = 1.0 if min_price == max_price else 1.0 - ((candidates["price"] - min_price) / (max_price - min_price))
        candidates["recommendation_score"] = (
            0.35 * candidates["active_match"]
            + 0.15 * (candidates["concern_overlap"].clip(0, 3) / 3)
            + 0.20 * (candidates["rating"] / 5.0)
            + 0.15 * (candidates["reviews_count"] / max_reviews).clip(0, 1)
            + 0.10 * price_score
            + 0.03 * candidates["skin_type_match"]
            + 0.01 * candidates["halal_bonus"]
            + 0.01 * candidates["fragrance_free_bonus"]
        )
        candidates = candidates.sort_values(["recommendation_score", "rating", "reviews_count"], ascending=False)
        original_top_n = request.top_n
        request.top_n = max(original_top_n * top_n_multiplier, original_top_n)
        results = self._format_results(candidates, request, "rule_based")
        request.top_n = original_top_n
        return results

    def _content_based(self, request: RecommendationRequest, top_n_multiplier: int = 1) -> list[dict[str, Any]]:
        df = self.products.copy()
        concerns = " ".join(ACTIVE_TO_CONCERN.get(request.active_ingredient, []))
        query = f"{request.active_ingredient} {request.diagnosis or ''} {concerns} {request.skin_type or ''} skincare serum toner moisturizer acne brightening hydrating"
        query_vector = self.vectorizer.transform([query])
        df["content_similarity"] = cosine_similarity(query_vector, self.product_vectors).flatten()
        df = self._apply_preferences(df, request)
        if df.empty:
            df = self._apply_preferences(self.products.copy(), RecommendationRequest(**{**request.__dict__, "budget_max": None}))
        df["active_exact_match"] = df["active_ingredients"].apply(lambda x: 1 if _contains_fuzzy(x, request.active_ingredient) else 0)
        df["recommendation_score"] = (
            0.60 * df["content_similarity"]
            + 0.20 * df["active_exact_match"]
            + 0.15 * (df["rating"] / 5.0)
            + 0.05 * df["skin_type_match"]
        )
        df = df.sort_values(["recommendation_score", "rating", "reviews_count"], ascending=False)
        original_top_n = request.top_n
        request.top_n = max(original_top_n * top_n_multiplier, original_top_n)
        results = self._format_results(df, request, "content_based")
        request.top_n = original_top_n
        return results

    def _hybrid(self, request: RecommendationRequest) -> list[dict[str, Any]]:
        extended_top_n = max(request.top_n * 3, 15)
        extended_request = RecommendationRequest(**{**request.__dict__, "top_n": extended_top_n})
        rule_results = self._rule_based(extended_request)
        content_results = self._content_based(extended_request)
        rule_scores = {item["product_id"]: item["score"] for item in rule_results}
        content_scores = {item["product_id"]: item["score"] for item in content_results}
        all_ids = set(rule_scores) | set(content_scores)
        df = self.products[self.products["product_id"].astype(str).isin(all_ids)].copy()
        df = self._apply_preferences(df, request)
        df["rule_score"] = df["product_id"].astype(str).map(rule_scores).fillna(0.0)
        df["content_score"] = df["product_id"].astype(str).map(content_scores).fillna(0.0)
        df["active_exact_match"] = df["active_ingredients"].apply(lambda x: 1 if _contains_fuzzy(x, request.active_ingredient) else 0)
        df["recommendation_score"] = 0.55 * df["rule_score"] + 0.45 * df["content_score"] + 0.05 * df["active_exact_match"]
        df = df.sort_values(["recommendation_score", "rating", "reviews_count"], ascending=False)
        return self._format_results(df, request, "hybrid")

    def _evaluate(self, results: list[dict[str, Any]], request: RecommendationRequest) -> float:
        if not results:
            return 0.0
        exact = np.mean([1 if _contains_fuzzy(item["active_ingredients"], request.active_ingredient) else 0 for item in results])
        rating = np.mean([item["rating"] for item in results]) / 5.0
        max_reviews = max(item["reviews_count"] for item in results) or 1
        reviews = np.mean([item["reviews_count"] / max_reviews for item in results])
        internal = np.mean([item["score"] for item in results])
        bonus = 0.0
        if request.prefer_halal:
            bonus += np.mean([1 if item["is_halal"] else 0 for item in results]) * 0.05
        if request.prefer_fragrance_free:
            bonus += np.mean([1 if not item["fragrance"] else 0 for item in results]) * 0.05
        return float(0.45 * exact + 0.25 * rating + 0.15 * reviews + 0.15 * internal + bonus)

    def recommend(self, request: RecommendationRequest, auto_select_model: bool = True) -> dict[str, Any]:
        models = {
            "rule_based": self._rule_based,
            "content_based": self._content_based,
            "hybrid": self._hybrid,
        }
        if auto_select_model:
            comparison = {}
            for name, fn in models.items():
                results = fn(request)
                comparison[name] = {"evaluation_score": round(self._evaluate(results, request), 4), "results": results}
            best = max(comparison, key=lambda k: comparison[k]["evaluation_score"])
            self.best_model_name = best
            return {
                "active_ingredient": request.active_ingredient,
                "diagnosis": request.diagnosis,
                "confidence_score": request.confidence_score,
                "selected_model": best,
                "model_comparison": {k: v["evaluation_score"] for k, v in comparison.items()},
                "recommendations": comparison[best]["results"],
            }
        results = models.get(self.best_model_name, self._hybrid)(request)
        return {
            "active_ingredient": request.active_ingredient,
            "diagnosis": request.diagnosis,
            "confidence_score": request.confidence_score,
            "selected_model": self.best_model_name,
            "model_comparison": None,
            "recommendations": results,
        }

    def recommend_from_diagnosis(
        self,
        diagnosis: str,
        active_ingredient: Optional[str] = None,
        confidence_score: Optional[float] = None,
        skin_type: Optional[str] = None,
        budget_max: Optional[int] = None,
        prefer_halal: bool = False,
        prefer_fragrance_free: bool = False,
        top_n: int = 5,
        auto_select_model: bool = True,
    ) -> dict[str, Any]:
        active = active_ingredient or DIAGNOSIS_TO_ACTIVE.get(diagnosis)
        if not active:
            raise ValueError(f"Zat aktif untuk diagnosis '{diagnosis}' tidak ditemukan.")
        request = RecommendationRequest(
            active_ingredient=active,
            diagnosis=diagnosis,
            confidence_score=confidence_score,
            skin_type=skin_type,
            budget_max=budget_max,
            prefer_halal=prefer_halal,
            prefer_fragrance_free=prefer_fragrance_free,
            top_n=top_n,
        )
        return {
            "diagnosis_result": {
                "diagnosis": diagnosis,
                "active_ingredient": active,
                "confidence_score": confidence_score,
            },
            "recommendation_result": self.recommend(request, auto_select_model=auto_select_model),
        }


@lru_cache
def get_recommendation_service() -> RecommendationService:
    return RecommendationService()
