import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useDiagnosisStore = create(persist((set) => ({
  selectedSymptoms: [], patientInfo: { name:'', age:'', gender:'' }, currentDiagnosis: null, history: [],
  setSelectedSymptoms: (selectedSymptoms) => set({ selectedSymptoms }),
  toggleSymptom: (code) => set(s => ({ selectedSymptoms: s.selectedSymptoms.includes(code) ? s.selectedSymptoms.filter(x=>x!==code) : [...s.selectedSymptoms, code] })),
  setPatientInfo: (patientInfo) => set({ patientInfo }),
  setCurrentDiagnosis: (currentDiagnosis) => set({ currentDiagnosis }),
  setHistory: (history) => set({ history }),
  clearDiagnosis: () => set({ selectedSymptoms: [], currentDiagnosis: null }),
}), { name: 'derma-diagnosis-store', partialize: (s) => ({ selectedSymptoms:s.selectedSymptoms, patientInfo:s.patientInfo }) }));
