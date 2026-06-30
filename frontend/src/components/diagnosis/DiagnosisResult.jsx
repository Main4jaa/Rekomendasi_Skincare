import ExpertSystemResult from './ExpertSystemResult';
import MLResult from './MLResult';
import IntegratedResult from './IntegratedResult';
import { useDiagnosis } from '../../hooks/useDiagnosis';
export default function DiagnosisResult({ result }){ const { saveDiagnosis } = useDiagnosis(); if(!result) return <div className="card text-center text-slate-500">Hasil diagnosis akan muncul di sini setelah Anda memilih gejala dan menekan tombol Diagnose.</div>; return <div className="space-y-4"><IntegratedResult data={result.integrated}/><ExpertSystemResult data={result.expert_system}/><MLResult data={result.ml_prediction}/><button className="btn-primary w-full" onClick={saveDiagnosis}>Save to History</button></div>; }
