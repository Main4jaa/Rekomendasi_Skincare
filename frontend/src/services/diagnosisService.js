import api from './api';

export const diagnosisService = {
  predict: (payload) => api.post('/api/diagnosis/predict', payload).then((r) => r.data),
  predictWithRecommendations: (payload, params = {}) =>
    api.post('/api/diagnosis/predict-with-recommendations', payload, { params }).then((r) => r.data),
  save: (payload) => api.post('/api/diagnosis/save', payload).then((r) => r.data),
  history: (params = {}) => api.get('/api/diagnosis/history', { params }).then((r) => r.data),
  stats: () => api.get('/api/diagnosis/stats').then((r) => r.data),
};
