import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Filter, Search, ShoppingBag, Sparkles } from 'lucide-react';
import ProductCard from '../components/recommendations/ProductCard';
import { skincareService } from '../services/skincareService';

const ALL = 'Semua';

function LoadingCards() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="h-80 animate-pulse rounded-[2rem] bg-white/70 shadow-xl dark:bg-slate-900/70" />
      ))}
    </div>
  );
}

export default function SkincarePage() {
  const [activeIngredients, setActiveIngredients] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(ALL);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = useMemo(() => {
    const values = [...new Set(products.map((item) => item.category).filter(Boolean))];
    return values.sort();
  }, [products]);

  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      setLoading(true);
      setError('');
      try {
        const [ingredients, productList] = await Promise.all([
          skincareService.activeIngredients(),
          skincareService.products({ limit: 100 }),
        ]);
        if (!isMounted) return;
        setActiveIngredients(ingredients);
        setProducts(productList);
      } catch (err) {
        if (!isMounted) return;
        setError(String(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitial();
    return () => { isMounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesIngredient = selectedIngredient === ALL || (product.active_ingredients || []).some((item) => String(item).toLowerCase().includes(selectedIngredient.toLowerCase()));
      if (!matchesIngredient) return false;
      if (!query) return true;
      const text = [
        product.name,
        product.brand,
        product.category,
        product.description,
        ...(product.active_ingredients || []),
        ...(product.target_concerns || []),
      ].join(' ').toLowerCase();
      return text.includes(query);
    });
  }, [products, search, selectedIngredient]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="glass-card overflow-hidden rounded-[2.75rem] p-6 md:p-8 fade-up">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge"><ShoppingBag size={15} /> Macam-macam skincare</span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">Database produk skincare</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Lihat daftar produk dari database lokal. Produk ini juga dipakai untuk menampilkan 3 rekomendasi teratas setelah cek kulit.
            </p>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-cyan-400 p-5 text-white shadow-2xl shadow-blue-100 dark:shadow-none">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20"><Sparkles /></div>
              <div>
                <p className="text-sm font-bold text-blue-50">Total produk</p>
                <p className="text-3xl font-black">{products.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="soft-card rounded-[2rem] p-4 md:p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_280px]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              className="input pl-12"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama produk, brand, bahan aktif, atau masalah kulit..."
            />
          </label>
          <label className="relative block">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select className="input pl-12" value={selectedIngredient} onChange={(event) => setSelectedIngredient(event.target.value)}>
              <option value={ALL}>Semua zat aktif</option>
              {activeIngredients.map((ingredient) => <option key={ingredient} value={ingredient}>{ingredient}</option>)}
            </select>
          </label>
        </div>
        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-black text-slate-500 dark:text-slate-300">
            {categories.map((category) => <span key={category} className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{category}</span>)}
          </div>
        )}
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          <div className="flex gap-2">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <b>Gagal memuat daftar skincare.</b> {error}
              <p className="mt-1">Pastikan backend aktif di <b>http://127.0.0.1:8000</b>, lalu refresh halaman.</p>
            </div>
          </div>
        </div>
      )}

      {loading ? <LoadingCards /> : (
        filteredProducts.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, index) => <ProductCard key={product.product_id || product.name} product={product} index={index} />)}
          </div>
        ) : (
          <div className="soft-card rounded-[2rem] p-8 text-center">
            <p className="text-lg font-black text-slate-900 dark:text-white">Produk tidak ditemukan</p>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Coba ganti kata kunci atau pilih zat aktif lain.</p>
          </div>
        )
      )}
    </div>
  );
}
