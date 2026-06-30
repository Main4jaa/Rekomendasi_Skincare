# SkinCare Check Simple - Fullstack Tanpa Supabase

Aplikasi ini terdiri dari:

- Backend FastAPI untuk diagnosis kulit dan rekomendasi skincare.
- Frontend React/Vite untuk input gejala dan menampilkan hasil.
- Database produk skincare berbasis CSV.
- Riwayat diagnosis berbasis JSON lokal.

Supabase sudah dihapus supaya project bisa langsung dijalankan secara lokal tanpa konfigurasi database eksternal.

## Quick Start Windows

```powershell
cd skincare-check-simple\derma-diagnosis-app
.\start_all.bat
```

Buka:

```text
Frontend: http://localhost:5173
Backend Docs: http://127.0.0.1:8000/docs
```

## Endpoint Utama Backend

- `GET /health`
- `GET /api/symptoms`
- `POST /api/diagnosis/predict`
- `POST /api/diagnosis/predict-with-recommendations`
- `POST /api/diagnosis/save`
- `GET /api/diagnosis/history`
- `GET /api/recommendations/products`
- `POST /api/recommendations/by-active`

## Data Lokal

- `backend/app/data/products.csv` berisi data produk skincare.
- `backend/app/data/diagnosis_history.json` dibuat otomatis untuk menyimpan riwayat.
