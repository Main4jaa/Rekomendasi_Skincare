# Fix akses macam-macam skincare

Versi ini memperbaiki akses daftar produk skincare dan endpoint rekomendasi.

## Yang diperbaiki

- Menambahkan menu **Skincare** di navbar.
- Menambahkan halaman `/skincare` untuk melihat macam-macam produk skincare dari `backend/app/data/products.csv`.
- Menambahkan endpoint alias yang lebih aman:
  - `GET /api/skincare/health`
  - `GET /api/skincare/active-ingredients`
  - `GET /api/skincare/products`
  - `GET /api/skincare/recommend?active_ingredient=Asam%20Salisilat&top_n=3`
- Endpoint lama tetap ada:
  - `GET /api/recommendations/products`
  - `GET /api/recommendations/active-ingredients`
  - `POST /api/recommendations/by-active`
- Parsing produk dibuat lebih aman supaya nilai kosong/NaN tidak bikin UI error.
- Filter produk berdasarkan zat aktif dibuat lebih fleksibel.
- Diagnosis tetap menampilkan 3 rekomendasi produk teratas di halaman hasil.

## Cara run

Jalankan dari folder `derma-diagnosis-app`:

```powershell
.\start_all.bat
```

Atau manual:

Terminal 1 backend:

```powershell
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

Terminal 2 frontend:

```powershell
cd frontend
npm run dev
```

Buka:

- Frontend: http://localhost:5173
- Backend docs: http://127.0.0.1:8000/docs
- Halaman skincare: http://localhost:5173/skincare

Kalau halaman skincare error, pastikan backend sudah menampilkan `Uvicorn running on http://127.0.0.1:8000`.
