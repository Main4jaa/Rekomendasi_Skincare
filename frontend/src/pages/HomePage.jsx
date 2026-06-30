import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, FlaskConical, HeartPulse, ShieldCheck, ShoppingBag, Sparkles, WandSparkles } from 'lucide-react';

const skinTips = [
  { title: 'Diagnosis gejala', text: 'Pilih 24 indikator gejala kulit. Sistem membaca pola dengan aturan pakar dan model machine learning.' },
  { title: 'Bahan aktif', text: 'Hasil diagnosis diterjemahkan menjadi zat aktif seperti asam salisilat, vitamin C, alpha arbutin, dan lainnya.' },
  { title: 'Produk skincare', text: 'Sistem rekomendasi mengurutkan produk berdasarkan kecocokan, rating, harga, dan preferensi kulit.' },
];

function HeroMockup() {
  return (
    <div className="relative min-h-[520px] fade-up">
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
      <div className="absolute bottom-0 left-8 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />

      <div className="absolute left-0 top-8 w-[76%] rounded-[2.5rem] border border-white/70 bg-white/85 p-5 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/85 float-slow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white"><HeartPulse className="text-blue-600" /> Cek kulit</div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">ML + CF</span>
        </div>
        <div className="mt-5 grid gap-3">
          {['Bintik terasa sakit', 'Merah meradang', 'Tidak terdapat nanah'].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">G{String(index + 9).padStart(2, '0')}</span>
              <span className="font-bold text-slate-700 dark:text-slate-200">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-28 w-[67%] rounded-[2.5rem] bg-gradient-to-br from-blue-700 via-cyan-600 to-emerald-500 p-6 text-white shadow-2xl">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/20 backdrop-blur"><Sparkles size={32} /></div>
        <p className="mt-5 text-sm font-black uppercase tracking-wide text-blue-50">Hasil utama</p>
        <h3 className="mt-2 text-3xl font-black">Papule</h3>
        <p className="mt-2 text-blue-50">Zat aktif: Asam Salisilat</p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20"><div className="h-full w-[86%] rounded-full bg-white" /></div>
        <p className="mt-2 text-sm font-bold text-blue-50">Confidence 86%</p>
      </div>

      <div className="absolute bottom-4 left-12 w-[72%] rounded-[2.5rem] border border-white/70 bg-white/90 p-5 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-200"><ShoppingBag /></div>
          <div>
            <p className="text-sm text-slate-500">Rekomendasi</p>
            <p className="font-black text-slate-950 dark:text-white">Produk diurutkan otomatis</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {['Rule', 'Content', 'Hybrid'].map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-center text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-200">{item}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="fade-up">
          <span className="badge"><WandSparkles size={15} /> Diagnosis kulit + rekomendasi skincare</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Pahami kondisi kulit dan temukan produk yang cocok.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Pilih gejala kulit, sistem menghitung diagnosis dan bahan aktif yang cocok, lalu menampilkan rekomendasi skincare berdasarkan database produk.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/diagnosis" className="btn-primary text-base">Diagnosa Sekarang <ArrowRight size={19} /></Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {['Forward chaining + CF', 'Ensemble ML', 'Skincare recommender'].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-2xl bg-white/70 p-3 text-sm font-bold text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-slate-200">
                <CheckCircle2 className="text-emerald-500" size={18} /> {item}
              </div>
            ))}
          </div>
        </div>
        <HeroMockup />
      </section>

      <section id="belajar" className="grid gap-5 md:grid-cols-3">
        {skinTips.map((tip, index) => (
          <article key={tip.title} className="soft-card rounded-[2rem] p-6 slide-in" style={{ animationDelay: `${index * 120}ms` }}>
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-200">
              {index === 0 ? <HeartPulse /> : index === 1 ? <FlaskConical /> : <ShoppingBag />}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">{tip.title}</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{tip.text}</p>
          </article>
        ))}
      </section>

      <section className="glass-card overflow-hidden rounded-[2.5rem] p-8 md:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <span className="badge"><ShieldCheck size={15} /> Siap mencoba?</span>
            <h2 className="mt-4 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">Mulai dari gejala sederhana, selesai dengan rekomendasi produk.</h2>
            <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Tidak perlu login atau Supabase. Riwayat disimpan lokal di backend dan produk dibaca dari CSV.</p>
          </div>
          <Link to="/diagnosis" className="btn-primary justify-self-start px-7 py-4 text-base lg:justify-self-end">Diagnosa Sekarang <ArrowRight size={20} /></Link>
        </div>
      </section>
    </div>
  );
}
