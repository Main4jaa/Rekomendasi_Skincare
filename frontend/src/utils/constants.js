export const CLASS_NAMES = {
  1: 'Psoriasis',
  2: 'Seborrheic Dermatitis',
  3: 'Lichen Planus',
  4: 'Pityriasis Rosea',
  5: 'Other',
};

export const SYMPTOMS = [
  { code:'G01', description:'Terasa kasar saat disentuh', cf:0.80, category:'Whitehead / Blackhead' },
  { code:'G02', description:'Bintik putih kekuningan di bawah permukaan kulit', cf:0.80, category:'Whitehead' },
  { code:'G03', description:'Bintik sebum ditutupi lapisan tipis kulit', cf:1.00, category:'Whitehead' },
  { code:'G04', description:'Bintik tidak sakit saat disentuh', cf:0.80, category:'Whitehead / Blackhead' },
  { code:'G05', description:'Muncul di daerah hidung, dagu, atau dahi', cf:0.80, category:'Whitehead / Blackhead' },
  { code:'G06', description:'Wajah tidak mulus', cf:0.80, category:'Whitehead' },
  { code:'G07', description:'Pori-pori kehitaman pada permukaan kulit', cf:1.00, category:'Blackhead' },
  { code:'G08', description:'Bintik sebum tidak ditutupi lapisan tipis kulit', cf:0.60, category:'Pustule' },
  { code:'G09', description:'Bintik terasa sakit saat disentuh', cf:0.80, category:'Pustule / Papule' },
  { code:'G10', description:'Kulit sekitar bintik memerah akibat radang', cf:0.83, category:'Pustule' },
  { code:'G11', description:'Terdapat cairan nanah di pucuk bintik', cf:0.80, category:'Pustule' },
  { code:'G12', description:'Diameter bintik beragam', cf:0.60, category:'Pustule' },
  { code:'G13', description:'Merah meradang pada bintik', cf:0.80, category:'Papule' },
  { code:'G14', description:'Tidak terdapat nanah pada pucuk bintik', cf:0.60, category:'Papule' },
  { code:'G15', description:'Bintik terasa keras dan gatal', cf:0.80, category:'Papule' },
  { code:'G16', description:'Kulit tampak tidak cerah', cf:0.70, category:'Kulit Kusam' },
  { code:'G17', description:'Kulit tampak gelap merata', cf:0.60, category:'Kulit Kusam' },
  { code:'G18', description:'Permukaan kulit tidak bercahaya', cf:0.60, category:'Kulit Kusam' },
  { code:'G19', description:'Kulit terasa lengket', cf:0.80, category:'Kulit Kendur / Dehidrasi' },
  { code:'G20', description:'Kulit tidak kenyal saat disentuh', cf:0.60, category:'Kulit Kendur / Dehidrasi' },
  { code:'G21', description:'Kulit tampak kendur dan dehidrasi', cf:0.60, category:'Kulit Kendur / Dehidrasi' },
  { code:'G22', description:'Bercak hitam keunguan', cf:0.75, category:'Hiperpigmentasi' },
  { code:'G23', description:'Bercak hitam keunguan tidak terasa sakit', cf:0.60, category:'Hiperpigmentasi' },
  { code:'G24', description:'Perubahan warna bercak setelah peradangan', cf:0.95, category:'Hiperpigmentasi' },
];

export const RULES = [
  { id:'R1', symptoms:['G01','G02','G03','G04','G05','G06'], diagnosis:'Whitehead', treatment:'Asam Laktat', classId:2 },
  { id:'R2', symptoms:['G01','G04','G05','G07'], diagnosis:'Blackhead', treatment:'Asam Glikolat', classId:2 },
  { id:'R3', symptoms:['G08','G09','G10','G11','G12'], diagnosis:'Pustule', treatment:'Benzoil Peroksida', classId:1 },
  { id:'R4', symptoms:['G09','G13','G14','G15'], diagnosis:'Papule', treatment:'Asam Salisilat', classId:3 },
  { id:'R5', symptoms:['G16','G17','G18'], diagnosis:'Kulit Kusam', treatment:'Vitamin C', classId:5 },
  { id:'R6', symptoms:['G19','G20','G21'], diagnosis:'Kulit Kendur/Dehidrasi', treatment:'Asam Hialuronat', classId:5 },
  { id:'R7', symptoms:['G22','G23','G24'], diagnosis:'Hiperpigmentasi', treatment:'Alpha Arbutin', classId:4 },
];

export const GENDERS = ['Laki-laki', 'Perempuan', 'Lainnya'];
