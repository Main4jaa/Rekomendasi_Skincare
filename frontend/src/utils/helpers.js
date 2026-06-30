export const formatDate = (value) => value ? new Date(value).toLocaleString('id-ID', { dateStyle:'medium', timeStyle:'short' }) : '-';
export const toPercent = (value) => `${Math.round((Number(value || 0)) * 100)}%`;
export const exportToCsv = (filename, rows) => {
  const safe = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const header = ['Tanggal','Nama Pasien','Diagnosis','Treatment','Confidence'];
  const body = rows.map(r => [r.created_at, r.patient_name, r.final_diagnosis, r.final_treatment, r.confidence_score].map(safe).join(','));
  const blob = new Blob([[header.join(','), ...body].join('\n')], { type:'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
};
