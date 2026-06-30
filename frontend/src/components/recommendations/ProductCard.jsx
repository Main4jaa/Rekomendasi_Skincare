import { BadgePercent, Leaf, ShoppingBag, Sparkles, Star } from 'lucide-react';

function rupiah(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split('|').map((item) => item.trim()).filter(Boolean);
}

export default function ProductCard({ product, index = 0 }) {
  const ingredients = normalizeList(product.active_ingredients).slice(0, 4);
  const concerns = normalizeList(product.target_concerns).slice(0, 3);
  const skinTypes = normalizeList(product.skin_type).slice(0, 3);
  const score = Number(product.recommendation_score ?? product.score ?? 0);

  return (
    <article
      className="product-card group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-xl shadow-slate-200/70 backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-200/50 blur-2xl transition group-hover:scale-125 dark:bg-cyan-500/10" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            <ShoppingBag size={13} /> {product.category || 'Skincare'}
          </span>
          <h3 className="mt-3 text-lg font-black leading-6 text-slate-950 dark:text-white">{product.name}</h3>
          <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-400">{product.brand}</p>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-200 dark:shadow-none">
          <Sparkles size={22} />
        </div>
      </div>

      <div className="relative mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-amber-50 p-3 dark:bg-amber-950/30">
          <p className="flex items-center gap-1 text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-200"><Star size={14} /> Rating</p>
          <p className="mt-1 text-xl font-black text-slate-950 dark:text-white">{Number(product.rating || 0).toFixed(1)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
          <p className="flex items-center gap-1 text-xs font-black uppercase tracking-wide text-emerald-700 dark:text-emerald-200"><BadgePercent size={14} /> Harga</p>
          <p className="mt-1 text-base font-black text-slate-950 dark:text-white">{rupiah(product.price)}</p>
        </div>
      </div>

      <p className="relative mt-4 min-h-[48px] text-sm leading-6 text-slate-600 dark:text-slate-300">{product.description}</p>

      <div className="relative mt-4 space-y-3">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Bahan aktif</p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((item) => <span key={item} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-700 dark:bg-cyan-950 dark:text-cyan-200">{item}</span>)}
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">Target masalah</p>
          <div className="flex flex-wrap gap-2">
            {concerns.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item}</span>)}
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex flex-wrap gap-2 text-xs font-black">
        {Boolean(product.is_halal) && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"><Leaf size={13} className="inline" /> Halal</span>}
        {!Boolean(product.fragrance) && <span className="rounded-full bg-purple-50 px-3 py-1 text-purple-700 dark:bg-purple-950 dark:text-purple-200">Fragrance-free</span>}
        {skinTypes.map((item) => <span key={item} className="rounded-full bg-blue-50 px-3 py-1 text-blue-700 dark:bg-blue-950 dark:text-blue-200">{item}</span>)}
        {score > 0 && <span className="rounded-full bg-slate-900 px-3 py-1 text-white dark:bg-white dark:text-slate-950">Score {score.toFixed(3)}</span>}
      </div>
    </article>
  );
}
