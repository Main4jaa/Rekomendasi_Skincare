import { Link, NavLink } from 'react-router-dom';
import { Sparkles, Moon, Sun } from 'lucide-react';
import { useUiStore } from '../../store/uiStore';

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/diagnosis', label: 'Cek Kulit' },
  { to: '/skincare', label: 'Skincare' },
  { to: '/about', label: 'Tentang' },
];

export default function Header() {
  const { darkMode, toggleDarkMode } = useUiStore();
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-slate-900 dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <Sparkles size={22} />
          </span>
          <span>SkinCare Check</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/diagnosis" className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex">Mulai Cek</Link>
        </div>
      </div>
    </header>
  );
}
