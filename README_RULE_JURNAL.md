# Perbaikan Rule Diagnosis Berbasis Jurnal

Versi ini memperbaiki hasil diagnosis dan rekomendasi skincare agar mengikuti basis pengetahuan dari jurnal referensi, terutama jurnal:

**Feri Febriansyah & Kana Saputra S. (2024)**, *Website Sistem Pakar Untuk Penderita Kulit Wajah Berminyak Memilih Bahan Utama Skincare Menggunakan Metode Certainty Factor*.

## Yang diperbaiki

1. Diagnosis akhir tidak lagi memakai label UCI Dermatology seperti `Psoriasis` atau `Seborrheic Dermatitis` sebagai hasil utama aplikasi skincare.
2. Diagnosis akhir sekarang mengikuti 7 masalah kulit:
   - Whitehead
   - Blackhead
   - Pustule
   - Papule
   - Kulit Kusam
   - Kulit Mengkilap Akibat Minyak Berlebih
   - Hiperpigmentasi
3. Zat aktif mengikuti 7 bahan utama:
   - Asam Laktat
   - Asam Glikolat
   - Benzoil Peroksida
   - Asam Salisilat
   - Vitamin C
   - Asam Hialuronat
   - Alpha Arbutin
4. Gejala G01-G24 dan nilai CF pakar diperbarui agar sesuai jurnal.
5. Jika gejala belum lengkap, sistem memakai rule terdekat, bukan langsung fallback “Konsultasi dokter”.
6. Rekomendasi produk tetap keluar 3 teratas berdasarkan zat aktif hasil diagnosis.

## File yang berubah

- `backend/app/core_constants.py`
- `backend/app/services/expert_system.py`
- `backend/app/services/diagnosis_service.py`
- `backend/app/services/ml_service.py`
- `backend/app/services/recommendation_service.py`

## Contoh hasil

Input:

```json
{
  "symptoms": ["G09", "G13", "G14", "G15"],
  "age": 25
}
```

Output utama:

```json
{
  "diagnosis": "Papule",
  "treatment": "Asam Salisilat",
  "match_type": "full_rule"
}
```

Rekomendasi produk akan mengambil 3 produk yang mengandung atau paling relevan dengan **Asam Salisilat**.
