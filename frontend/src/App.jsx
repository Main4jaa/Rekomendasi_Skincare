import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ToastNotification from './components/common/ToastNotification';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageLoader from './components/common/PageLoader';
import { useUiStore } from './store/uiStore';

export default function App(){
  const { darkMode } = useUiStore();
  const location = useLocation();
  const [booting, setBooting] = useState(true);
  const [changing, setChanging] = useState(false);

  useEffect(() => { document.documentElement.classList.toggle('dark', darkMode); }, [darkMode]);
  useEffect(() => { const timer = setTimeout(() => setBooting(false), 650); return () => clearTimeout(timer); }, []);
  useEffect(() => {
    if (booting) return;
    setChanging(true);
    const timer = setTimeout(() => setChanging(false), 420);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <div className="app-bg flex min-h-screen flex-col">
        {(booting || changing) && <PageLoader title={booting ? 'Selamat datang di SkinCare Check' : 'Memuat halaman...'} subtitle="Kami buat prosesnya pelan, jelas, dan mudah diikuti." />}
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
        <ToastNotification />
      </div>
    </ErrorBoundary>
  );
}
