"""Basis pengetahuan diagnosis kulit dan rekomendasi zat aktif.

Versi ini menggabungkan CF pakar dari beberapa jurnal menjadi satu basis pengetahuan.
Prinsip yang dipakai:
1. Gejala dari berbagai jurnal dinormalisasi ke kode G01-G24.
2. Nilai CF pakar yang tersedia digabung dengan metode rata-rata (Average CF).
3. Aturan diagnosis menggunakan 7 masalah kulit wajah dan 7 bahan aktif skincare.

Rujukan utama:
- Febriansyah & Saputra (JURSI TGD, 2024): 24 gejala, 7 masalah kulit, 7 bahan aktif, CF pakar.
- Puspitasari dkk. (BIOS, 2024): CF gejala dan serum wajah.
- Subianto dkk. (MEANS, 2023): CF untuk diagnosis jenis/masalah kulit.
- Ramlah dkk. (BUSITI, 2021): MB/MD yang dikonversi menjadi CF = MB - MD.
"""

ACTIVE_INGREDIENTS = {
    "B1": "Asam Laktat",
    "B2": "Asam Glikolat",
    "B3": "Benzoil Peroksida",
    "B4": "Asam Salisilat",
    "B5": "Vitamin C",
    "B6": "Asam Hialuronat",
    "B7": "Alpha Arbutin",
}

CLASS_NAMES = {
    1: "Whitehead",
    2: "Blackhead",
    3: "Pustule",
    4: "Papule",
    5: "Kulit Kusam",
    6: "Kulit Mengkilap Akibat Minyak Berlebih",
    7: "Hiperpigmentasi",
}

# Gejala final yang dipakai sistem. Nilai cf di sini adalah nilai default lintas gejala.
# Perhitungan utama memakai CF pakar per-rule di RULES["symptom_cfs"], karena beberapa gejala
# yang sama dapat memiliki bobot berbeda pada bahan aktif/masalah kulit yang berbeda.
SYMPTOMS = [
    {"code": "G01", "description": "Terasa kasar saat disentuh", "cf": 0.80, "category": "Whitehead / Blackhead"},
    {"code": "G02", "description": "Bintik berwarna putih kekuningan di bawah permukaan kulit", "cf": 0.80, "category": "Whitehead"},
    {"code": "G03", "description": "Bintik sebum ditutupi dengan lapisan tipis kulit", "cf": 1.00, "category": "Whitehead"},
    {"code": "G04", "description": "Bintik tidak sakit saat disentuh", "cf": 0.80, "category": "Whitehead / Blackhead"},
    {"code": "G05", "description": "Muncul di daerah hidung, dagu, atau dahi", "cf": 0.80, "category": "Whitehead / Blackhead"},
    {"code": "G06", "description": "Wajah tidak mulus", "cf": 0.80, "category": "Whitehead"},
    {"code": "G07", "description": "Pori-pori berwarna kehitaman pada permukaan kulit", "cf": 1.00, "category": "Blackhead"},
    {"code": "G08", "description": "Bintik sebum tidak ditutupi dengan lapisan tipis kulit / berkomedo", "cf": 0.40, "category": "Blackhead / Pustule"},
    {"code": "G09", "description": "Bintik terasa sakit saat disentuh", "cf": 0.80, "category": "Pustule / Papule"},
    {"code": "G10", "description": "Kulit sekitar bintik memerah akibat radang", "cf": 0.83, "category": "Pustule"},
    {"code": "G11", "description": "Terdapat cairan nanah di pucuk bintik", "cf": 0.80, "category": "Pustule"},
    {"code": "G12", "description": "Diameter bintik yang beragam", "cf": 0.60, "category": "Pustule"},
    {"code": "G13", "description": "Merah meradang pada bintik", "cf": 1.00, "category": "Papule"},
    {"code": "G14", "description": "Tidak terdapat nanah pada pucuk bintik", "cf": 0.60, "category": "Papule"},
    {"code": "G15", "description": "Bintik terasa keras dan gatal", "cf": 0.80, "category": "Papule"},
    {"code": "G16", "description": "Kulit tampak tidak cerah", "cf": 0.70, "category": "Kulit Kusam"},
    {"code": "G17", "description": "Kulit tampak gelap merata", "cf": 0.60, "category": "Kulit Kusam"},
    {"code": "G18", "description": "Permukaan kulit tidak bercahaya", "cf": 0.60, "category": "Kulit Kusam"},
    {"code": "G19", "description": "Kulit terasa lengket", "cf": 0.80, "category": "Kulit Mengkilap Akibat Minyak Berlebih"},
    {"code": "G20", "description": "Kulit tidak kenyal saat disentuh", "cf": 0.60, "category": "Kulit Mengkilap Akibat Minyak Berlebih"},
    {"code": "G21", "description": "Kulit tampak kendur dan dehidrasi", "cf": 0.60, "category": "Kulit Mengkilap Akibat Minyak Berlebih"},
    {"code": "G22", "description": "Bercak besar atau kecil berwarna hitam keunguan", "cf": 0.75, "category": "Hiperpigmentasi"},
    {"code": "G23", "description": "Bercak hitam keunguan tidak terasa sakit", "cf": 0.60, "category": "Hiperpigmentasi"},
    {"code": "G24", "description": "Perubahan warna pada bercak timbul setelah peradangan atau cedera pada kulit", "cf": 0.95, "category": "Hiperpigmentasi"},
]

SYMPTOM_CF = {item["code"]: float(item["cf"]) for item in SYMPTOMS}
SYMPTOM_LABELS = {item["code"]: item["description"] for item in SYMPTOMS}

# Nilai CF pakar gabungan per aturan dipakai sebagai ringkasan laporan dan penguat skor.
RULE_CF_GABUNGAN = {
    "R1": 0.80,
    "R2": 0.80,
    "R3": 0.60,
    "R4": 0.80,
    "R5": 0.70,
    "R6": 0.60,
    "R7": 0.75,
}

RULES = [
    {
        "id": "R1",
        "symptoms": ["G01", "G02", "G03", "G04", "G05", "G06"],
        "symptom_cfs": {"G01": 0.80, "G02": 0.80, "G03": 1.00, "G04": 0.80, "G05": 0.80, "G06": 0.80},
        "rule_cf": 0.80,
        "diagnosis": "Whitehead",
        "treatment": "Asam Laktat",
        "active_code": "B1",
        "class_id": 1,
        "explanation": "Gejala mengarah ke whitehead/komedo tertutup; bahan aktif yang disarankan adalah Asam Laktat.",
    },
    {
        "id": "R2",
        "symptoms": ["G01", "G04", "G05", "G07"],
        "symptom_cfs": {"G01": 0.80, "G04": 0.80, "G05": 0.80, "G07": 1.00},
        "rule_cf": 0.80,
        "diagnosis": "Blackhead",
        "treatment": "Asam Glikolat",
        "active_code": "B2",
        "class_id": 2,
        "explanation": "Gejala mengarah ke blackhead/komedo terbuka; bahan aktif yang disarankan adalah Asam Glikolat.",
    },
    {
        "id": "R3",
        "symptoms": ["G08", "G09", "G10", "G11", "G12"],
        "symptom_cfs": {"G08": 0.40, "G09": 0.80, "G10": 0.83, "G11": 0.80, "G12": 0.60},
        "rule_cf": 0.60,
        "diagnosis": "Pustule",
        "treatment": "Benzoil Peroksida",
        "active_code": "B3",
        "class_id": 3,
        "explanation": "Gejala nyeri, radang, dan nanah mengarah ke pustule; bahan aktif yang disarankan adalah Benzoil Peroksida.",
    },
    {
        "id": "R4",
        "symptoms": ["G09", "G13", "G14", "G15"],
        "symptom_cfs": {"G09": 0.80, "G13": 1.00, "G14": 0.60, "G15": 0.80},
        "rule_cf": 0.80,
        "diagnosis": "Papule",
        "treatment": "Asam Salisilat",
        "active_code": "B4",
        "class_id": 4,
        "explanation": "Gejala bintik meradang tanpa nanah mengarah ke papule; bahan aktif yang disarankan adalah Asam Salisilat.",
    },
    {
        "id": "R5",
        "symptoms": ["G16", "G17", "G18"],
        "symptom_cfs": {"G16": 0.70, "G17": 0.60, "G18": 0.60},
        "rule_cf": 0.70,
        "diagnosis": "Kulit Kusam",
        "treatment": "Vitamin C",
        "active_code": "B5",
        "class_id": 5,
        "explanation": "Gejala kulit tidak cerah dan tidak bercahaya mengarah ke kulit kusam; bahan aktif yang disarankan adalah Vitamin C.",
    },
    {
        "id": "R6",
        "symptoms": ["G19", "G20", "G21"],
        "symptom_cfs": {"G19": 0.80, "G20": 0.60, "G21": 0.60},
        "rule_cf": 0.60,
        "diagnosis": "Kulit Mengkilap Akibat Minyak Berlebih",
        "treatment": "Asam Hialuronat",
        "active_code": "B6",
        "class_id": 6,
        "explanation": "Gejala lengket, kurang kenyal, dan dehidrasi diarahkan ke dukungan hidrasi dengan Asam Hialuronat.",
    },
    {
        "id": "R7",
        "symptoms": ["G22", "G23", "G24"],
        "symptom_cfs": {"G22": 0.75, "G23": 0.60, "G24": 0.95},
        "rule_cf": 0.75,
        "diagnosis": "Hiperpigmentasi",
        "treatment": "Alpha Arbutin",
        "active_code": "B7",
        "class_id": 7,
        "explanation": "Gejala bercak gelap pascaperadangan mengarah ke hiperpigmentasi; bahan aktif yang disarankan adalah Alpha Arbutin.",
    },
]

DIAGNOSIS_TO_ACTIVE = {rule["diagnosis"]: rule["treatment"] for rule in RULES}
ACTIVE_TO_DIAGNOSIS = {rule["treatment"]: rule["diagnosis"] for rule in RULES}
