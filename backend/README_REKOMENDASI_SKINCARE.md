# Integrasi Rekomendasi Skincare

Backend ini sudah ditambahkan modul rekomendasi produk skincare yang terhubung dengan hasil diagnosis kulit.

## File yang ditambahkan

```text
app/data/products.csv
app/services/recommendation_service.py
app/schemas/recommendation.py
app/routes/recommendation.py
```

File yang diubah:

```text
app/main.py
app/routes/diagnosis.py
requirements.txt
```

## Endpoint baru

### 1. Cek service rekomendasi

```http
GET /api/recommendations/health
```

### 2. Lihat daftar zat aktif

```http
GET /api/recommendations/active-ingredients
```

### 3. Lihat produk

```http
GET /api/recommendations/products
GET /api/recommendations/products?active_ingredient=Asam%20Salisilat
```

### 4. Rekomendasi langsung dari zat aktif

```http
POST /api/recommendations/by-active
```

Body:

```json
{
  "active_ingredient": "Asam Salisilat",
  "diagnosis": "Papule",
  "confidence_score": 0.86,
  "skin_type": "Oily",
  "budget_max": 150000,
  "prefer_halal": true,
  "prefer_fragrance_free": true,
  "top_n": 5,
  "auto_select_model": true
}
```

### 5. Rekomendasi dari diagnosis

```http
POST /api/recommendations/from-diagnosis
```

Body:

```json
{
  "diagnosis": "Papule",
  "active_ingredient": "Asam Salisilat",
  "confidence_score": 0.86,
  "skin_type": "Oily",
  "budget_max": 150000,
  "prefer_halal": true,
  "prefer_fragrance_free": true,
  "top_n": 5,
  "auto_select_model": true
}
```

### 6. Diagnosis + rekomendasi dalam satu request

```http
POST /api/diagnosis/predict-with-recommendations?skin_type=Oily&budget_max=150000&prefer_halal=true&prefer_fragrance_free=true&top_n=5
```

Body:

```json
{
  "symptoms": ["G09", "G13", "G14", "G15"],
  "age": 25
}
```

Endpoint ini akan menjalankan diagnosis yang sudah ada, mengambil `integrated.diagnosis`, `integrated.treatment` sebagai zat aktif, lalu mengembalikan rekomendasi produk.

## Model rekomendasi

Sistem membandingkan 3 pendekatan:

1. `rule_based`: prioritas produk yang mengandung zat aktif + rating + harga + review + preferensi.
2. `content_based`: TF-IDF + cosine similarity dari kandungan, concern, kategori, deskripsi, dan skin type.
3. `hybrid`: gabungan skor rule-based dan content-based.

Output selalu menyertakan:

```json
"selected_model": "rule_based",
"model_comparison": {
  "rule_based": 0.9542,
  "content_based": 0.9173,
  "hybrid": 0.9534
}
```

Jadi backend bisa mengecek apakah rekomendasi terbaik berasal dari gabungan model atau satu model saja.

## Cara jalanin

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Catatan: database produk saat ini berisi data prototipe. Untuk production, ganti `app/data/products.csv` dengan data produk asli.
