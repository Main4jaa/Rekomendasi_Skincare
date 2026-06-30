# Backend DermaDiagnosis

```bash
cd backend
cp .env.example .env
python -m venv venv
# Windows: venv\Scripts\activate
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Letakkan model ML pada `backend/models/`:
- `best_ensemble_model.pkl`
- `dermatology_scaler.pkl`
- `symptom_to_feature_mapping.pkl`

Jika model belum ada, endpoint `/predict` tetap berjalan dengan fallback sederhana untuk development, tetapi produksi harus memakai file `.pkl` asli.
