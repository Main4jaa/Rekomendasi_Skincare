from __future__ import annotations

from app.core_constants import RULES, SYMPTOM_CF, SYMPTOM_LABELS
from app.utils.helpers import combine_cf


def _rank_rule(rule: dict, observed: set[str]) -> dict:
    required = list(rule["symptoms"])
    matched = [code for code in required if code in observed]
    missing = [code for code in required if code not in observed]

    if matched:
        rule_cfs = rule.get("symptom_cfs", {})
        matched_cfs = [float(rule_cfs.get(code, SYMPTOM_CF.get(code, 0.0))) for code in matched]
        cf_matched = combine_cf(matched_cfs)
    else:
        cf_matched = 0.0

    coverage = len(matched) / max(len(required), 1)
    # Skor final dibuat seimbang: coverage gejala dominan, lalu CF pakar memperkuat.
    rule_cf = float(rule.get("rule_cf", cf_matched))
    score = round((0.55 * coverage) + (0.35 * cf_matched) + (0.10 * rule_cf), 4)

    return {
        **rule,
        "required_symptoms": required,
        "matched_symptoms": matched,
        "missing_symptoms": missing,
        "matched_symptom_details": [
            {"code": code, "description": SYMPTOM_LABELS.get(code, code), "cf_pakar": float(rule.get("symptom_cfs", {}).get(code, SYMPTOM_CF.get(code, 0.0)))}
            for code in matched
        ],
        "missing_symptom_details": [
            {"code": code, "description": SYMPTOM_LABELS.get(code, code), "cf_pakar": float(rule.get("symptom_cfs", {}).get(code, SYMPTOM_CF.get(code, 0.0)))}
            for code in missing
        ],
        "coverage": round(coverage, 4),
        "cf": cf_matched,
        "rule_cf": rule_cf,
        "score": score,
        "is_full_match": len(missing) == 0,
    }


class ExpertSystem:
    def forward_chaining(self, observed_symptoms: list[str]) -> dict:
        observed = set(observed_symptoms or [])
        ranked_rules = [_rank_rule(rule, observed) for rule in RULES]
        ranked_rules = sorted(ranked_rules, key=lambda item: (item["is_full_match"], item["score"], item["coverage"]), reverse=True)

        full_matches = [rule for rule in ranked_rules if rule["is_full_match"] and rule["matched_symptoms"]]
        if full_matches:
            best = full_matches[0]
            match_type = "full_rule"
        else:
            # Partial fallback tetap dipakai agar sistem tidak asal “Konsultasi dokter”.
            # Minimal ada 1 gejala cocok. Jika tidak ada gejala valid, hasilnya Unknown.
            partials = [rule for rule in ranked_rules if rule["matched_symptoms"]]
            if not partials:
                return {
                    "diagnosis": None,
                    "treatment": None,
                    "active_code": None,
                    "class_id": None,
                    "cf": 0.0,
                    "coverage": 0.0,
                    "score": 0.0,
                    "match_type": "no_match",
                    "matched_rules": [],
                    "ranked_rules": ranked_rules,
                    "explanation": "Belum ada gejala yang cocok dengan basis pengetahuan.",
                }
            best = partials[0]
            match_type = "partial_rule"

        return {
            "diagnosis": best["diagnosis"],
            "treatment": best["treatment"],
            "active_code": best.get("active_code"),
            "class_id": best["class_id"],
            "cf": best["cf"],
            "coverage": best["coverage"],
            "score": best["score"],
            "match_type": match_type,
            "matched_symptoms": best["matched_symptoms"],
            "missing_symptoms": best["missing_symptoms"],
            "matched_symptom_details": best["matched_symptom_details"],
            "missing_symptom_details": best["missing_symptom_details"],
            "matched_rules": full_matches,
            "ranked_rules": ranked_rules,
            "explanation": best.get("explanation") or f"Rule terbaik adalah {best['id']} dengan skor {best['score']}.",
        }

    def rank_rules(self, observed_symptoms: list[str]) -> list[dict]:
        observed = set(observed_symptoms or [])
        return sorted([_rank_rule(rule, observed) for rule in RULES], key=lambda item: item["score"], reverse=True)
