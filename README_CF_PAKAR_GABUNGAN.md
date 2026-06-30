# CF Pakar Gabungan

Versi ini menggabungkan CF pakar dari beberapa jurnal menjadi satu basis pengetahuan, bukan memisahkan rule per jurnal.

## Konsep

1. Gejala dari berbagai jurnal dinormalisasi ke G01-G24.
2. Nilai CF langsung digunakan apa adanya.
3. Nilai MB dan MD dikonversi menjadi CF dengan rumus `CF = MB - MD`.
4. Jika satu gejala memiliki nilai dari beberapa jurnal, nilai tersebut digabung dengan metode rata-rata:

```text
CF Pakar Gabungan = (CF1 + CF2 + ... + CFn) / n
```

## File yang diubah

```text
backend/app/core_constants.py
backend/app/services/expert_system.py
```

## Basis rule final

| Rule | Gejala | Diagnosis | Bahan aktif | CF Pakar Gabungan |
|---|---|---|---|---|
| R1 | G01, G02, G03, G04, G05, G06 | Whitehead | Asam Laktat | 0.80 |
| R2 | G01, G04, G05, G07 | Blackhead | Asam Glikolat | 0.80 |
| R3 | G08, G09, G10, G11, G12 | Pustule | Benzoil Peroksida | 0.60 |
| R4 | G09, G13, G14, G15 | Papule | Asam Salisilat | 0.80 |
| R5 | G16, G17, G18 | Kulit Kusam | Vitamin C | 0.70 |
| R6 | G19, G20, G21 | Kulit Mengkilap Akibat Minyak Berlebih | Asam Hialuronat | 0.60 |
| R7 | G22, G23, G24 | Hiperpigmentasi | Alpha Arbutin | 0.75 |

## Cara kerja backend

Saat user memilih gejala, backend akan:

1. Mencocokkan gejala dengan rule R1-R7.
2. Menghitung coverage gejala.
3. Menghitung CF dari bobot `symptom_cfs` di tiap rule.
4. Memakai `rule_cf` sebagai penguat skor.
5. Menentukan diagnosis paling sesuai.
6. Mengambil bahan aktif dari diagnosis.
7. Menghasilkan rekomendasi produk skincare berdasarkan bahan aktif.

