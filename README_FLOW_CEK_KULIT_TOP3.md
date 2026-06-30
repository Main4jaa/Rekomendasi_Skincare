# Update Flow Cek Kulit + Top 3 Produk

Perubahan pada versi ini:

1. Halaman rekomendasi terpisah `/recommendations` dihapus dari routing dan navbar.
2. Flow utama hanya lewat halaman **Cek Kulit**.
3. Saat user klik **Lihat Hasil**, frontend memanggil endpoint:

```http
POST /api/diagnosis/predict-with-recommendations?top_n=3
```

4. Halaman hasil sekarang menampilkan:
   - diagnosis kulit,
   - confidence score,
   - zat aktif/saran utama,
   - **Top 3 rekomendasi produk skincare** di panel kanan, berurutan nomor 1 sampai 3.

5. Produk yang tampil bukan hanya zat aktif, tetapi detail produk:
   - nama produk,
   - brand,
   - kategori,
   - harga,
   - rating,
   - bahan aktif,
   - target masalah,
   - score rekomendasi.

Cara jalan:

```powershell
cd skincare-check-simple\derma-diagnosis-app
.\start_all.bat
```

Atau manual:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Terminal kedua:

```powershell
cd frontend
npm install
npm run dev
```
