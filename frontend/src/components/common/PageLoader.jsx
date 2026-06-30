export default function PageLoader({ title = 'Menyiapkan halaman...', subtitle = 'Sebentar ya, aplikasi sedang memuat dengan aman.' }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-white/85 backdrop-blur-xl dark:bg-slate-950/85">
      <div className="soft-card mx-4 max-w-sm rounded-[2rem] p-8 text-center fade-up">
        <div className="mx-auto loader-ring" />
        <h2 className="mt-5 text-xl font-black text-slate-900 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{subtitle}</p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 pulse-soft" />
        </div>
      </div>
    </div>
  );
}
