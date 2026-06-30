# Backend Tanpa Supabase

Versi ini tidak membutuhkan Supabase, PostgreSQL, atau database eksternal.

Yang dipakai:
- diagnosis kulit: service Python lokal
- rekomendasi skincare: `app/data/products.csv`
- riwayat diagnosis: `app/data/diagnosis_history.json`

## Jalankan Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Buka dokumentasi API:

```text
http://127.0.0.1:8000/docs
```

## Endpoint Utama

- `POST /api/diagnosis/predict`
- `POST /api/diagnosis/predict-with-recommendations`
- `POST /api/diagnosis/save`
- `GET /api/diagnosis/history`
- `GET /api/recommendations/products`
- `POST /api/recommendations/by-active`
