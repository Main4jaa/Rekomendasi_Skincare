import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Camera, CheckCircle2, ScanSearch, ShieldCheck, Sparkles, UserRound, WandSparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import SymptomSelector from '../components/symptoms/SymptomSelector';
import PageLoader from '../components/common/PageLoader';
import { useDiagnosisStore } from '../store/diagnosisStore';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { useUiStore } from '../store/uiStore';

function DetectionVisual() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[2.4rem] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-5 text-white shadow-2xl">
      <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="absolute -bottom-20 right-4 h-60 w-60 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="scanner-line" />

      <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-black text-cyan-100"><ScanSearch size={18} /> Skin scanner</div>
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-black text-emerald-100">Ready</span>
        </div>

        <div className="relative mx-auto mt-8 grid h-44 w-44 place-items-center rounded-full bg-gradient-to-br from-blue-200/20 to-cyan-200/10 ring-1 ring-white/20 pulse-soft">
          <div className="absolute h-36 w-36 rounded-full border border-dashed border-cyan-200/50" />
          <div className="absolute h-24 w-24 rounded-full border border-dashed border-emerald-200/50" />
          <div className="grid h-20 w-20 place-items-center rounded-[2rem] bg-white text-blue-700 shadow-2xl">
            <Camera size={34} />
          </div>
          <span className="absolute -left-3 top-10 rounded-full bg-white px-3 py-1 text-xs font-black text-blue-700 shadow-lg">G09</span>
          <span className="absolute -right-5 bottom-12 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700 shadow-lg">CF 0.86</span>
        </div>

        <div className="mt-8 grid gap-3">
          {[
            ['Gejala dibaca', '24 indikator'],
            ['Diagnosis', 'Forward chaining + ML'],
            ['Output', 'Zat aktif + rekomendasi'],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm backdrop-blur">
              <span className="text-cyan-100">{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DiagnosisPage() {
  const navigate = useNavigate();
  const { patientInfo, setPatientInfo, selectedSymptoms } = useDiagnosisStore();
  const { runDiagnosis } = useDiagnosis();
  const { error } = useUiStore();
  const [processing, setProcessing] = useState(false);

  const completion = useMemo(() => Math.min(100, Math.round((selectedSymptoms.length / 6) * 100)), [selectedSymptoms.length]);

  const handleDiagnose = async () => {
    setProcessing(true);
    const startedAt = Date.now();
    const result = await runDiagnosis();
    const remaining = Math.max(0, 1300 - (Date.now() - startedAt));
    setTimeout(() => {
      setProcessing(false);
      if (result) navigate('/result');
    }, remaining);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {processing && <PageLoader title="Sedang membaca gejala kulitmu..." subtitle="Sistem memproses pilihanmu dengan model machine learning, aturan pakar, dan layer rekomendasi skincare." />}
      <button onClick={() => navigate('/')} className="btn-secondary px-4 py-2 text-sm"><ArrowLeft size={17} /> Kembali</button>

      <section className="glass-card rounded-[2.75rem] p-6 md:p-8 fade-up">
        <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <span className="badge"><WandSparkles size={15} /> Diagnosis + rekomendasi produk</span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">Deteksi gejala kulit, lalu dapatkan zat aktif dan produk skincare.</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Isi data singkat, pilih gejala yang paling mirip, lalu sistem akan menampilkan diagnosis, confidence score, bahan aktif, dan rekomendasi produk.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['01', 'Pilih gejala'],
                ['02', 'Model membaca pola'],
                ['03', 'Produk direkomendasikan'],
              ].map(([step, text]) => (
                <div key={step} className="rounded-2xl bg-white/70 p-4 shadow-sm dark:bg-slate-900/70">
                  <p className="text-xs font-black text-blue-600 dark:text-blue-300">STEP {step}</p>
                  <p className="mt-1 font-black text-slate-800 dark:text-white">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <DetectionVisual />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <aside className="soft-card h-fit rounded-[2rem] p-6 fade-up">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-200"><UserRound /></div>
            <div>
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Data singkat</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Opsional, untuk membantu personalisasi hasil.</p>
            </div>
          </div>
          <div className="space-y-3">
            <input className="input" placeholder="Nama panggilan, opsional" value={patientInfo.name || ''} onChange={(event) => setPatientInfo({ ...patientInfo, name: event.target.value })} />
            <input className="input" type="number" min="1" placeholder="Umur, contoh: 21" value={patientInfo.age || ''} onChange={(event) => setPatientInfo({ ...patientInfo, age: event.target.value })} />
            <select className="input" value={patientInfo.gender || ''} onChange={(event) => setPatientInfo({ ...patientInfo, gender: event.target.value })}>
              <option value="">Jenis kelamin, opsional</option>
              <option value="Perempuan">Perempuan</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <select className="input" value={patientInfo.skin_type || ''} onChange={(event) => setPatientInfo({ ...patientInfo, skin_type: event.target.value })}>
              <option value="">Jenis kulit untuk rekomendasi, opsional</option>
              <option value="Oily">Oily / Berminyak</option>
              <option value="Dry">Dry / Kering</option>
              <option value="Sensitive">Sensitive / Sensitif</option>
              <option value="Combination">Combination / Kombinasi</option>
              <option value="Normal">Normal</option>
            </select>
            <div className="grid gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800"><input type="checkbox" checked={Boolean(patientInfo.prefer_halal)} onChange={(event) => setPatientInfo({ ...patientInfo, prefer_halal: event.target.checked })} /> Prioritaskan halal</label>
              <label className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-800"><input type="checkbox" checked={Boolean(patientInfo.prefer_fragrance_free)} onChange={(event) => setPatientInfo({ ...patientInfo, prefer_fragrance_free: event.target.checked })} /> Tanpa fragrance</label>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/40">
            <div className="flex items-center justify-between text-sm font-black text-blue-700 dark:text-blue-200"><span>Progress gejala</span><span>{selectedSymptoms.length} dipilih</span></div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white dark:bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500" style={{ width: `${completion}%` }} /></div>
            <p className="mt-3 flex gap-2 text-sm leading-6 text-blue-800 dark:text-blue-100"><ShieldCheck size={18} className="mt-0.5 shrink-0" /> Pilih minimal satu gejala. Untuk hasil lebih kuat, pilih gejala yang paling dominan.</p>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="badge"><Sparkles size={15} /> Langkah utama</span>
              <h2 className="mt-3 text-2xl font-black text-slate-950 dark:text-white">Pilih gejala yang sesuai</h2>
            </div>
            <button disabled={!selectedSymptoms.length || processing} onClick={handleDiagnose} className="btn-primary hidden px-6 py-3 md:inline-flex">
              Lihat Hasil <ArrowRight size={19} />
            </button>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
              <div className="flex gap-2">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <div>
                  <b>Gagal memproses diagnosis.</b> {error}
                  <p className="mt-1">Pastikan backend menyala di <b>http://127.0.0.1:8000</b>, lalu klik Lihat Hasil lagi.</p>
                </div>
              </div>
            </div>
          )}
          <SymptomSelector />
        </section>
      </section>

      <div className="sticky bottom-4 z-30 mx-auto max-w-xl rounded-full border border-slate-200 bg-white/90 p-2 shadow-2xl backdrop-blur md:hidden">
        <button disabled={!selectedSymptoms.length || processing} onClick={handleDiagnose} className="btn-primary w-full">
          Lihat Hasil ({selectedSymptoms.length}) <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
