# Cara Menjalankan Project Tanpa Supabase

Project ini sudah dibuat tanpa Supabase. Jadi tidak perlu `SUPABASE_URL`, `SUPABASE_KEY`, PostgreSQL, atau akun Supabase.

## Jalankan Semua Sekaligus

Dari folder `derma-diagnosis-app`, klik dua kali:

```text
start_all.bat
```

Atau dari PowerShell:

```powershell
cd skincare-check-simple\derma-diagnosis-app
.\start_all.bat
```

Setelah jalan, buka:

```text
Frontend: http://localhost:5173
Backend Docs: http://127.0.0.1:8000/docs
```

## Jalankan Manual

Terminal 1, backend:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Terminal 2, frontend:

```powershell
cd frontend
npm install
npm run dev
```

## Penyimpanan Data

- Produk skincare: `backend/app/data/products.csv`
- Riwayat diagnosis lokal: `backend/app/data/diagnosis_history.json`

Kalau file `diagnosis_history.json` belum ada, backend akan membuatnya otomatis saat kamu menyimpan diagnosis pertama.


## Kalau klik Lihat Hasil tidak bereaksi

Buka DevTools. Kalau ada error `ERR_CONNECTION_REFUSED 127.0.0.1:8000`, artinya frontend sudah jalan tetapi backend belum menyala. Jalankan backend dari folder `backend`:

```powershell
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Setelah muncul `Uvicorn running on http://127.0.0.1:8000`, baru klik **Lihat Hasil** lagi di frontend.
