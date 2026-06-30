import { diagnosisService } from '../services/diagnosisService';
import { skincareService } from '../services/skincareService';
import { useDiagnosisStore } from '../store/diagnosisStore';
import { useUiStore } from '../store/uiStore';

function getDiagnosisPayload(currentDiagnosis) {
  return currentDiagnosis?.diagnosis ? currentDiagnosis.diagnosis : currentDiagnosis;
}

export function useDiagnosis() {
  const { selectedSymptoms, patientInfo, currentDiagnosis, setCurrentDiagnosis } = useDiagnosisStore();
  const { setLoading, setError, showToast } = useUiStore();

  const runDiagnosis = async () => {
    if (!selectedSymptoms.length) {
      showToast({ type: 'error', message: 'Pilih minimal satu gejala.' });
      return null;
    }

    setLoading(true);
    setError(null);

    const params = {
      skin_type: patientInfo.skin_type || undefined,
      prefer_halal: Boolean(patientInfo.prefer_halal),
      prefer_fragrance_free: Boolean(patientInfo.prefer_fragrance_free),
      top_n: 3,
    };

    try {
      let result;
      try {
        result = await diagnosisService.predictWithRecommendations(
          { symptoms: selectedSymptoms, age: Number(patientInfo.age || 0) },
          params,
        );
      } catch (recommendationError) {
        // Fallback aman: diagnosis tetap jalan, lalu ambil rekomendasi dari zat aktif hasil diagnosis.
        const diagnosisOnly = await diagnosisService.predict({ symptoms: selectedSymptoms, age: Number(patientInfo.age || 0) });
        const activeIngredient = diagnosisOnly?.integrated?.treatment || diagnosisOnly?.expert_system?.treatment || 'Asam Salisilat';
        let recommendationResult = null;
        try {
          recommendationResult = await skincareService.recommend({
            active_ingredient: activeIngredient,
            diagnosis: diagnosisOnly?.integrated?.diagnosis || diagnosisOnly?.expert_system?.diagnosis,
            skin_type: patientInfo.skin_type || undefined,
            prefer_halal: Boolean(patientInfo.prefer_halal),
            prefer_fragrance_free: Boolean(patientInfo.prefer_fragrance_free),
            top_n: 3,
          });
        } catch (fallbackError) {
          recommendationResult = null;
        }
        result = {
          diagnosis: diagnosisOnly,
          skincare_recommendations: recommendationResult ? {
            diagnosis_result: {
              diagnosis: diagnosisOnly?.integrated?.diagnosis || diagnosisOnly?.expert_system?.diagnosis,
              active_ingredient: activeIngredient,
              confidence_score: diagnosisOnly?.integrated?.confidence_score,
            },
            recommendation_result: recommendationResult,
          } : null,
          recommendation_error: String(recommendationError),
        };
      }

      setCurrentDiagnosis(result);
      showToast({ type: 'success', message: 'Diagnosis dan rekomendasi berhasil diproses.' });
      return result;
    } catch (error) {
      const message = String(error).includes('Network Error') || String(error).includes('ERR_NETWORK')
        ? 'Backend belum berjalan atau tidak bisa diakses. Jalankan backend dengan: python -m uvicorn app.main:app --reload'
        : String(error);
      setError(message);
      showToast({ type: 'error', message });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const saveDiagnosis = async () => {
    if (!currentDiagnosis) return;
    setLoading(true);

    const diagnosisPayload = getDiagnosisPayload(currentDiagnosis);

    try {
      const payload = {
        patient_id: patientInfo.patient_id || null,
        patient_name: patientInfo.name || 'Pasien Tanpa Nama',
        symptoms: selectedSymptoms,
        expert_diagnosis: diagnosisPayload.expert_system?.diagnosis,
        expert_treatment: diagnosisPayload.expert_system?.treatment,
        expert_cf: diagnosisPayload.expert_system?.cf,
        ml_diagnosis: diagnosisPayload.ml_prediction?.class_name,
        ml_confidence: diagnosisPayload.ml_prediction?.confidence,
        ml_probabilities: diagnosisPayload.ml_prediction?.probabilities,
        final_diagnosis: diagnosisPayload.integrated?.diagnosis,
        final_treatment: diagnosisPayload.integrated?.treatment,
        confidence_score: diagnosisPayload.integrated?.confidence_score,
      };

      await diagnosisService.save(payload);
      showToast({ type: 'success', message: 'Riwayat diagnosis berhasil disimpan lokal.' });
    } catch (error) {
      showToast({ type: 'error', message: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return { runDiagnosis, saveDiagnosis };
}
