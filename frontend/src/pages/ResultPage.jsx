import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download, Heart, Home, RotateCcw, ShieldAlert, Sparkles, ShoppingBag, Star, BadgePercent, Leaf } from 'lucide-react';
import ProbabilityChart from '../components/visualization/ProbabilityChart';
import ConfidenceGauge from '../components/visualization/ConfidenceGauge';
import { useDiagnosisStore } from '../store/diagnosisStore';
import { useDiagnosis } from '../hooks/useDiagnosis';

function percent(value) {
  const number = Number(value || 0);
  return `${Math.round(number * 100)}%`;
}

function rupiah(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split('|').map((item) => item.trim()).filter(Boolean);
}

function simpleMeaning(diagnosis) {
  const text = String(diagnosis || '').toLowerCase();
  if (text.includes('seborrheic')) return 'Kemungkinan berkaitan dengan komedo, pori-pori tersumbat, atau kondisi berminyak di area wajah tertentu.';
  if (text.includes('psoriasis')) return 'Sistem melihat pola yang mirip dengan keluhan kulit meradang. Perhatikan bila merah, nyeri, atau berulang.';
  if (text.includes('lichen')) return 'Sistem melihat pola bintik/ruam yang terasa keras, gatal, atau meradang.';
  if (text.includes('pityriasis')) return 'Sistem melihat pola bercak atau perubahan warna pada kulit.';
  return 'Sistem memberi hasil umum karena gejala yang dipilih belum cukup kuat mengarah ke satu kondisi spesifik.';
}

function getRecommendationPayload(currentDiagnosis) {
  return currentDiagnosis?.skincare_recommendations?.recommendation_result || currentDiagnosis?.skincare_recommendations || null;
}

function TopProductItem({ product, index }) {
  const ingredients = normalizeList(product.active_ingredients).slice(0, 3);
  const concerns = normalizeList(product.target_concerns).slice(0, 2);
  const score = Number(product.recommendation_score ?? product.score ?? 0);

  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/90 p-4 shadow-lg shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-none">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-200/40 blur-2xl transition group-hover:scale-125 dark:bg-cyan-500/10" />
      <div className="relative flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-lg font-black text-white shadow-lg shadow-blue-100 dark:shadow-none">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-700 dark:bg-blue-950 dark:text-blue-200">{product.category || 'Skincare'}</span>
            {score > 0 && <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white dark:bg-white dark:text-slate-950">Score {score.toFixed(3)}</span>}
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-black leading-5 text-slate-950 dark:text-white">{product.name}</h3>
          <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{product.brand}</p>
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/30">
          <p className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-amber-700 dark:text-amber-200"><Star size={13} /> Rating</p>
          <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{Number(product.rating || 0).toFixed(1)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <p className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200"><BadgePercent size={13} /> Harga</p>
          <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{rupiah(product.price)}</p>
        </div>
      </div>

      <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {ingredients.map((item) => <span key={item} className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-black text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200">{item}</span>)}
        {concerns.map((item) => <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</span>)}
        {Boolean(product.is_halal) && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"><Leaf size={12} className="inline" /> Halal</span>}
      </div>
    </article>
  );
}

function TopProductPanel({ currentDiagnosis, treatment }) {
  const recommendationResult = getRecommendationPayload(currentDiagnosis);
  const products = (recommendationResult?.recommendations || []).slice(0, 3);

  return (
    <aside className="relative overflow-hidden rounded-[2rem] bg-white/85 p-5 shadow-xl shadow-slate-200/60 dark:bg-slate-900/85 dark:shadow-none">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-200/50 blur-3xl dark:bg-cyan-500/10" />
      <div className="relative flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 p-3 text-white shadow-lg shadow-blue-100 dark:shadow-none">
          <ShoppingBag size={26} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Top 3 rekomendasi skincare</p>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Produk dengan {recommendationResult?.active_ingredient || treatment || 'zat aktif cocok'}</h2>
        </div>
      </div>

      {products.length ? (
        <>
          <div className="relative mt-4 space-y-3">
            {products.map((product, index) => <TopProductItem key={product.product_id || product.name} product={product} index={index} />)}
          </div>
          <div className="relative mt-4 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-800 dark:bg-blue-950/40 dark:text-blue-100">
            Diurutkan otomatis dari produk paling cocok. Model terpilih: <b>{recommendationResult?.selected_model || 'hybrid'}</b>.
          </div>
        </>
      ) : (
        <div className="relative mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Rekomendasi produk belum diterima dari backend. Pastikan endpoint <b>/api/diagnosis/predict-with-recommendations</b> aktif dan database <b>products.csv</b> tersedia.
        </div>
      )}
    </aside>
  );
}

function simpleTreatment(treatment) {
  const text = String(treatment || '').toLowerCase();
  if (text.includes('asam laktat')) return 'Pertimbangkan perawatan eksfoliasi ringan seperti asam laktat. Mulai pelan dan gunakan sunscreen.';
  if (text.includes('asam glikolat')) return 'Pertimbangkan eksfoliasi ringan seperti asam glikolat, terutama untuk komedo dan tekstur kulit.';
  if (text.includes('benzoil')) return 'Untuk jerawat bernanah/meradang, bahan seperti benzoil peroksida sering dipakai, tetapi gunakan bertahap.';
  if (text.includes('salisilat')) return 'Asam salisilat sering dipakai untuk pori tersumbat dan jerawat kecil. Jangan dipakai berlebihan.';
  if (text.includes('vitamin c')) return 'Vitamin C dapat membantu tampilan kulit kusam. Gunakan pagi hari dan tetap pakai sunscreen.';
  if (text.includes('hialuronat')) return 'Asam hialuronat membantu hidrasi kulit. Cocok dipadukan dengan pelembap sederhana.';
  if (text.includes('arbutin')) return 'Alpha arbutin sering digunakan untuk tampilan noda gelap. Hasil biasanya bertahap dan butuh sunscreen.';
  return treatment || 'Gunakan skincare dasar: pembersih lembut, pelembap, dan sunscreen. Konsultasi bila keluhan berat.';
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { currentDiagnosis, selectedSymptoms, clearDiagnosis } = useDiagnosisStore();
  const { saveDiagnosis } = useDiagnosis();

  if (!currentDiagnosis) {
    return (
      <div className="mx-auto max-w-2xl text-center fade-up">
        <div className="soft-card rounded-[2rem] p-8">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-100 text-amber-600"><ShieldAlert size={32} /></div>
          <h1 className="mt-5 text-3xl font-black text-slate-950 dark:text-white">Belum ada hasil diagnosis</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Silakan pilih gejala terlebih dahulu agar sistem bisa menampilkan hasil.</p>
          <Link to="/diagnosis" className="btn-primary mt-6">Mulai Cek Kulit</Link>
        </div>
      </div>
    );
  }

  const diagnosisPayload = currentDiagnosis.diagnosis || currentDiagnosis;
  const expert = diagnosisPayload.expert_system || {};
  const ml = diagnosisPayload.ml_prediction || {};
  const integrated = diagnosisPayload.integrated || {};
  const diagnosis = integrated.diagnosis || ml.class_name || expert.diagnosis || 'Belum diketahui';
  const treatment = integrated.treatment || expert.treatment;

  const handleRestart = () => {
    clearDiagnosis();
    navigate('/diagnosis');
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <button onClick={() => navigate('/diagnosis')} className="btn-secondary px-4 py-2 text-sm"><ArrowLeft size={17} /> Ubah Gejala</button>

      <section className="glass-card overflow-hidden rounded-[2.5rem] p-6 md:p-8 fade-up">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
          <div className="space-y-5">
            <div>
              <span className="badge">Hasil pengecekan kulit</span>
              <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">Kemungkinan utama: {diagnosis}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{simpleMeaning(diagnosis)}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">Confidence {percent(integrated.confidence_score || ml.confidence || expert.cf)}</span>
                <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-black text-blue-700 dark:bg-blue-950 dark:text-blue-200">{selectedSymptoms.length} gejala dibaca</span>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/80 p-6 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600"><Heart size={28} /></div>
                <div>
                  <p className="text-sm font-bold text-slate-500">Zat aktif / saran utama</p>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">{treatment || 'Skincare dasar'}</h2>
                </div>
              </div>
              <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{simpleTreatment(treatment)}</p>
              <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                Catatan: hasil ini adalah bantuan awal, bukan pengganti dokter. Hentikan produk bila iritasi dan konsultasi jika gejala berat.
              </div>
            </div>
          </div>

          <TopProductPanel currentDiagnosis={currentDiagnosis} treatment={treatment} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <article className="soft-card rounded-[2rem] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Sparkles /></div>
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Hasil utama</h2>
          </div>
          <ConfidenceGauge value={integrated.confidence_score || ml.confidence || expert.cf || 0} label="Tingkat keyakinan sistem" />
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">Sistem menggabungkan aturan pakar dan model machine learning. Tampilan ini disederhanakan agar mudah dibaca.</p>
        </article>

        <article className="soft-card rounded-[2rem] p-6 lg:col-span-2">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Kemungkinan dari model machine learning</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Grafik ini menunjukkan seberapa kuat model melihat tiap kemungkinan.</p>
          <div className="mt-4">
            <ProbabilityChart probabilities={ml.probabilities || {}} />
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="soft-card rounded-[2rem] p-6">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Gejala yang cocok menurut aturan</h2>
          {expert.matched_rules?.length ? (
            <div className="mt-4 space-y-3">
              {expert.matched_rules.map((rule) => (
                <div key={rule.rule_id || rule.id} className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="font-black text-slate-800 dark:text-white">{rule.rule_id || rule.id} - {rule.diagnosis}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Keyakinan aturan: {percent(rule.cf)}</p>
                </div>
              ))}
            </div>
          ) : <p className="mt-3 text-slate-600 dark:text-slate-300">Belum ada aturan yang cocok penuh. Sistem tetap memakai model ML sebagai bantuan.</p>}
        </article>

        <article className="soft-card rounded-[2rem] p-6">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">Apa yang sebaiknya dilakukan?</h2>
          <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
            <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} /> Gunakan pembersih wajah yang lembut dan jangan terlalu sering menggosok kulit.</li>
            <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} /> Pakai pelembap dan sunscreen, terutama jika memakai bahan aktif seperti acid atau vitamin C.</li>
            <li className="flex gap-3"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-500" size={20} /> Konsultasi ke dokter bila nyeri berat, menyebar, berdarah, bernanah banyak, atau tidak membaik.</li>
          </ul>
        </article>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button onClick={saveDiagnosis} className="btn-secondary"><Download size={18} /> Simpan ke Riwayat</button>
        <button onClick={handleRestart} className="btn-primary"><RotateCcw size={18} /> Cek Ulang</button>
        <Link to="/" className="btn-secondary"><Home size={18} /> Beranda</Link>
      </div>
    </div>
  );
}
