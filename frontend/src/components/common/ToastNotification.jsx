import { useEffect } from 'react';
import { useUiStore } from '../../store/uiStore';
export default function ToastNotification(){ const { toast, clearToast } = useUiStore(); useEffect(()=>{ if(toast){ const t=setTimeout(clearToast,3500); return()=>clearTimeout(t); }},[toast,clearToast]); if(!toast) return null; const cls = toast.type==='error'?'bg-red-600':toast.type==='warning'?'bg-orange-500':'bg-emerald-600'; return <div className={`fixed right-4 top-4 z-50 rounded-xl px-4 py-3 text-white shadow-lg ${cls}`}>{toast.message}</div>; }
