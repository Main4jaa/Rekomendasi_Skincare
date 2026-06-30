import api from './api';

function listFrom(data) {
  if (Array.isArray(data)) return data;
  return data?.items || data?.products || data?.recommendations || data?.active_ingredients || [];
}

export const recommendationService = {
  health: () => api.get('/api/recommendations/health').then((r) => r.data),
  activeIngredients: () => api.get('/api/recommendations/active-ingredients').then((r) => r.data),
  activeIngredientsList: () => api.get('/api/recommendations/active-ingredients').then((r) => listFrom(r.data)),
  products: (params = {}) => api.get('/api/recommendations/products', { params }).then((r) => r.data),
  productsList: (params = {}) => api.get('/api/recommendations/products', { params }).then((r) => listFrom(r.data)),
  byActive: (payload) => api.post('/api/recommendations/by-active', payload).then((r) => r.data),
  fromDiagnosis: (payload) => api.post('/api/recommendations/from-diagnosis', payload).then((r) => r.data),
};
