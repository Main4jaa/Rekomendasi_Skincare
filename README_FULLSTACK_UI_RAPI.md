# SkinCare Check - Fullstack UI Rapi

Versi ini sudah dibersihkan dari Supabase dan frontend sudah punya halaman rekomendasi skincare.

## Fitur baru

- Halaman `/recommendations` untuk mencari produk berdasarkan zat aktif.
- Halaman hasil diagnosis menampilkan rekomendasi produk skincare otomatis.
- UI diagnosis diperbaiki, termasuk visual scanner tanpa gambar eksternal yang rawan broken image.
- Search gejala diperbaiki dengan tombol clear dan empty state.
- Animasi diperhalus: scanner line, floating cards, product hover, fade-up cards.
- Navbar sudah punya menu `Rekomendasi`.

## Cara jalanin

```powershell
cd skincare-check-simple\derma-diagnosis-app
.\start_all.bat
```

Manual backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Manual frontend:

```powershell
cd frontend
npm install
npm run dev
```

URL:

- Frontend: http://localhost:5173
- Backend docs: http://127.0.0.1:8000/docs

## Endpoint rekomendasi yang dipakai frontend

- `POST /api/diagnosis/predict-with-recommendations`
- `GET /api/recommendations/active-ingredients`
- `POST /api/recommendations/by-active`

## Data

- Database produk: `backend/app/data/products.csv`
- Riwayat diagnosis lokal: `backend/app/data/diagnosis_history.json`
