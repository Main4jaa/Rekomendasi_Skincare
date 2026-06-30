import { Check, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SYMPTOMS } from '../../utils/constants';
import { useDiagnosisStore } from '../../store/diagnosisStore';

const friendlyGroups = [
  { title: 'Komedo & pori-pori', hint: 'Pilih kalau ada bintik putih, komedo hitam, atau tekstur kasar.', match: ['Whitehead', 'Blackhead'], gradient: 'from-cyan-500 to-blue-600' },
  { title: 'Jerawat meradang', hint: 'Pilih kalau bintik terasa sakit, merah, keras, atau ada nanah.', match: ['Pustule', 'Papule'], gradient: 'from-rose-500 to-orange-500' },
  { title: 'Kulit kusam', hint: 'Pilih kalau wajah terlihat gelap, tidak cerah, atau tidak bercahaya.', match: ['Kulit Kusam'], gradient: 'from-amber-500 to-yellow-500' },
  { title: 'Kering, kendur, atau dehidrasi', hint: 'Pilih kalau kulit terasa lengket, kurang kenyal, atau tampak dehidrasi.', match: ['Kulit Kendur / Dehidrasi'], gradient: 'from-emerald-500 to-teal-500' },
  { title: 'Bercak hitam', hint: 'Pilih kalau ada noda/bercak gelap setelah radang atau jerawat.', match: ['Hiperpigmentasi'], gradient: 'from-violet-500 to-fuchsia-500' },
];

function isInGroup(symptom, group) {
  return group.match.some((name) => symptom.category.includes(name));
}

export default function SymptomSelector() {
  const { selectedSymptoms, toggleSymptom, setSelectedSymptoms } = useDiagnosisStore();
  const [query, setQuery] = useState('');

  const groups = useMemo(() => friendlyGroups.map((group) => ({
    ...group,
    symptoms: SYMPTOMS.filter((symptom) => isInGroup(symptom, group)).filter((symptom) => {
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return symptom.description.toLowerCase().includes(q) || symptom.code.toLowerCase().includes(q) || symptom.category.toLowerCase().includes(q);
    }),
  })).filter((group) => group.symptoms.length), [query]);

  return (
    <div className="space-y-5">
      <div className="soft-card rounded-[2rem] p-5 fade-up">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Pilih gejala yang kamu rasakan</h2>
            <p className="mt-1 text-slate-600 dark:text-slate-300">Tidak harus semuanya. Pilih yang paling mirip dengan kondisi kulitmu.</p>
          </div>
          <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 dark:bg-blue-950 dark:text-blue-200">{selectedSymptoms.length} gejala dipilih</span>
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-11 pr-11" placeholder="Cari gejala, contoh: bintik, merah, gatal..." value={query} onChange={(event) => setQuery(event.target.value)} />
            {query && <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"><X size={16} /></button>}
          </div>
          <button className="btn-secondary" onClick={() => setSelectedSymptoms(SYMPTOMS.map((s) => s.code))}><SlidersHorizontal size={18} /> Pilih Semua</button>
          <button className="btn-secondary" onClick={() => setSelectedSymptoms([])}><RotateCcw size={18} /> Reset</button>
        </div>
      </div>

      {groups.map((group, groupIndex) => (
        <section key={group.title} className="soft-card overflow-hidden rounded-[2rem] p-0 fade-up" style={{ animationDelay: `${groupIndex * 90}ms` }}>
          <div className={`bg-gradient-to-r ${group.gradient} p-5 text-white`}>
            <h3 className="text-lg font-black">{group.title}</h3>
            <p className="mt-1 text-sm text-white/85">{group.hint}</p>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-2">
            {group.symptoms.map((symptom) => {
              const checked = selectedSymptoms.includes(symptom.code);
              return (
                <button key={symptom.code} type="button" onClick={() => toggleSymptom(symptom.code)} className={`group flex min-h-[92px] items-start gap-3 rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${checked ? 'border-blue-500 bg-blue-50 shadow-blue-100 dark:bg-blue-950/50 dark:shadow-none' : 'border-slate-200 bg-white hover:border-blue-200 dark:border-slate-700 dark:bg-slate-900'}`}>
                  <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${checked ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 text-transparent group-hover:border-blue-300'}`}>
                    <Check size={17} />
                  </span>
                  <span>
                    <span className="block text-xs font-black uppercase tracking-wide text-slate-400">{symptom.code} • CF {symptom.cf}</span>
                    <span className="mt-1 block font-bold leading-6 text-slate-800 dark:text-slate-100">{symptom.description}</span>
                    <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-500 dark:bg-slate-800 dark:text-slate-300">{symptom.category}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}

      {!groups.length && (
        <div className="soft-card rounded-[2rem] p-8 text-center fade-up">
          <Search className="mx-auto text-slate-400" size={42} />
          <h3 className="mt-4 text-xl font-black text-slate-950 dark:text-white">Gejala tidak ditemukan</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Coba kata lain seperti merah, bintik, bercak, sakit, atau kode G01.</p>
        </div>
      )}
    </div>
  );
}
