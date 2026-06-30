# Fix CORS dan Cara Run

Versi ini sudah diperbaiki supaya frontend tidak lagi request langsung ke `http://127.0.0.1:8000` dari browser.
Frontend memakai proxy Vite:

```text
React /api/... -> Vite proxy -> FastAPI http://127.0.0.1:8000
```

Jadi error CORS seperti ini tidak muncul lagi:

```text
blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

## Jalankan Backend

Terminal 1:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Pastikan muncul:

```text
Uvicorn running on http://127.0.0.1:8000
```

## Jalankan Frontend

Terminal 2:

```powershell
cd frontend
npm install
npm run dev
```

Buka:

```text
http://localhost:5173
```

## Catatan

- Frontend sekarang memakai `VITE_API_URL=` kosong agar request lewat proxy `/api`.
- Backend tetap diberi CORS longgar untuk development lokal.
- Warning React Router future flag bukan error dan tidak menghambat aplikasi.
