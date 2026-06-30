import os
from pathlib import Path
from functools import lru_cache
import joblib
import numpy as np
from app.core_constants import CLASS_NAMES
class MLService:
    def __init__(self):
        self.model_path = Path(os.getenv('MODEL_PATH', 'models/best_ensemble_model.pkl'))
        self.scaler_path = Path(os.getenv('SCALER_PATH', 'models/dermatology_scaler.pkl'))
        self.mapping_path = Path(os.getenv('MAPPING_PATH', 'models/symptom_to_feature_mapping.pkl'))
        self.model = self._load_optional(self.model_path)
        self.scaler = self._load_optional(self.scaler_path)
        self.mapping = self._load_optional(self.mapping_path) or {}
    def _load_optional(self, path: Path):
        if path.exists(): return joblib.load(path)
        alt = Path.cwd() / path
        if alt.exists(): return joblib.load(alt)
        return None
    def map_symptoms_to_features(self, symptoms: list[str], age: int | None = 0) -> np.ndarray:
        vector = np.zeros(33, dtype=float)
        if self.mapping:
            for code in symptoms:
                spec = self.mapping.get(code) or self.mapping.get(code.lower())
                if spec is None: continue
                if isinstance(spec, int): vector[spec] = 1
                elif isinstance(spec, dict): vector[int(spec.get('index', 0))] = float(spec.get('value', 1))
                elif isinstance(spec, (list, tuple)):
                    idx, val = int(spec[0]), float(spec[1] if len(spec) > 1 else 1); vector[idx] = val
        else:
            # Fallback development mapping agar endpoint tetap bisa diuji sebelum file pkl tersedia.
            for code in symptoms:
                if code.startswith('G') and code[1:].isdigit():
                    idx = min(32, int(code[1:]) - 1); vector[idx] = 1
        if age is not None:
            vector[-1] = float(age)
        return vector.reshape(1, -1)
    def predict(self, symptoms: list[str], age: int | None = 0) -> dict:
        X = self.map_symptoms_to_features(symptoms, age)
        if self.scaler is not None:
            X = self.scaler.transform(X)
        if self.model is None:
            # Fallback development: probability sederhana berbasis gejala. Produksi wajib memakai pkl.
            scores = {cid:0.05 for cid in CLASS_NAMES}
            groups = {1:{'G01','G02','G03','G04','G05','G06'},2:{'G01','G04','G05','G07','G08'},3:{'G09','G10','G11','G12'},4:{'G09','G13','G14','G15'},5:{'G16','G17','G18'},6:{'G19','G20','G21'},7:{'G22','G23','G24'}}
            obs=set(symptoms)
            for cid, req in groups.items(): scores[cid] += len(obs & req) / max(1, len(req))
            total=sum(scores.values()); probs={CLASS_NAMES[k]: round(v/total,4) for k,v in scores.items()}; best=max(scores, key=scores.get)
            return {'class_id': best, 'class_name': CLASS_NAMES[best], 'confidence': probs[CLASS_NAMES[best]], 'probabilities': probs, 'model_loaded': False}
        if hasattr(self.model, 'predict_proba'):
            raw = self.model.predict_proba(X)[0]
            classes = list(getattr(self.model, 'classes_', list(CLASS_NAMES.keys())))
            prob_by_id = {int(c): float(p) for c,p in zip(classes, raw)}
            best = max(prob_by_id, key=prob_by_id.get)
        else:
            best = int(self.model.predict(X)[0]); prob_by_id = {cid: (1.0 if cid == best else 0.0) for cid in CLASS_NAMES}
        probabilities = {CLASS_NAMES[cid]: round(prob_by_id.get(cid, 0.0), 4) for cid in CLASS_NAMES}
        return {'class_id': best, 'class_name': CLASS_NAMES.get(best, str(best)), 'confidence': round(prob_by_id.get(best, 0.0), 4), 'probabilities': probabilities, 'model_loaded': True}
@lru_cache
def get_ml_service(): return MLService()
