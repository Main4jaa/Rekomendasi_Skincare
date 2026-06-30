from __future__ import annotations

from app.core_constants import CLASS_NAMES, RULES, SYMPTOM_CF
from app.services.expert_system import ExpertSystem
from app.services.ml_service import get_ml_service


def _partial_rule_fallback(symptoms: list[str]) -> dict:
    observed = set(symptoms or [])
    if not observed:
        return {"diagnosis": None, "treatment": None, "class_id": None, "cf": 0.0, "matched_symptoms": []}

    candidates = []
    for rule in RULES:
        required = set(rule["symptoms"])
        matched = list(required & observed)
        if not matched:
            continue
        coverage = len(matched) / max(len(required), 1)
        cf_avg = sum(float(SYMPTOM_CF.get(code, 0)) for code in matched) / max(len(matched), 1)
        score = (0.65 * coverage) + (0.35 * cf_avg)
        candidates.append({**rule, "matched_symptoms": matched, "partial_score": round(score, 4), "partial_coverage": round(coverage, 4)})

    if not candidates:
        return {"diagnosis": None, "treatment": None, "class_id": None, "cf": 0.0, "matched_symptoms": []}

    best = max(candidates, key=lambda item: (item["partial_score"], item["partial_coverage"]))
    return {
        "diagnosis": best.get("diagnosis"),
        "treatment": best.get("treatment"),
        "active_code": best.get("active_code"),
        "class_id": best.get("class_id"),
        "cf": float(best.get("partial_score") or 0),
        "coverage": float(best.get("partial_coverage") or 0),
        "matched_symptoms": best.get("matched_symptoms", []),
        "explanation": best.get("explanation"),
    }


class DiagnosisService:
    def __init__(self):
        self.expert = ExpertSystem()
        self.ml = get_ml_service()

    def predict(self, symptoms: list[str], age: int | None = 0) -> dict:
        expert = self.expert.forward_chaining(symptoms)
        partial = _partial_rule_fallback(symptoms)
        ml = self.ml.predict(symptoms, age)
        integrated = self.integrate(expert, ml, partial)
        return {
            "expert_system": expert,
            "ml_prediction": ml,
            "partial_rule": partial,
            "integrated": integrated,
        }

    def integrate(self, expert: dict, ml: dict, partial: dict | None = None) -> dict:
        partial = partial or {}

        # Untuk aplikasi skincare ini, keputusan utama harus mengikuti basis pengetahuan jurnal
        # G01-G24 + CF pakar, bukan label dermatology UCI yang berbeda domain.
        source = "expert_system"
        if expert.get("diagnosis"):
            final_diagnosis = expert.get("diagnosis")
            treatment = expert.get("treatment")
            confidence = float(expert.get("score") or expert.get("cf") or 0)
            coverage = float(expert.get("coverage") or 0)
            match_type = expert.get("match_type")
        elif partial.get("diagnosis"):
            final_diagnosis = partial.get("diagnosis")
            treatment = partial.get("treatment")
            confidence = float(partial.get("cf") or 0)
            coverage = float(partial.get("coverage") or 0)
            match_type = "partial_rule"
            source = "partial_rule"
        else:
            final_diagnosis = "Rekomendasi Umum"
            treatment = "Asam Salisilat"
            confidence = 0.0
            coverage = 0.0
            match_type = "fallback"
            source = "fallback"

        # ML dipertahankan sebagai pendukung. Jika model pkl belum ada, ML fallback tidak mengambil alih keputusan.
        ml_support = {
            "diagnosis": ml.get("class_name"),
            "confidence": ml.get("confidence"),
            "model_loaded": ml.get("model_loaded", False),
        }

        # Confidence akhir dibuat 0-1 dan tidak boleh 0 jika ada rule partial.
        confidence = max(0.0, min(1.0, round(confidence, 4)))

        return {
            "diagnosis": final_diagnosis,
            "treatment": treatment or "Asam Salisilat",
            "active_ingredient": treatment or "Asam Salisilat",
            "confidence_score": confidence,
            "coverage": round(coverage, 4),
            "match_type": match_type,
            "decision_source": source,
            "ml_support": ml_support,
            "scores": {name: (confidence if name == final_diagnosis else 0.0) for name in CLASS_NAMES.values()},
            "explanation": (
                f"Hasil utama diambil dari {source}. Diagnosis {final_diagnosis} "
                f"dipilih dengan kecocokan gejala {coverage:.2f} dan confidence {confidence:.2f}. "
                f"Zat aktif yang digunakan untuk rekomendasi produk adalah {treatment or 'Asam Salisilat'}."
            ),
        }
