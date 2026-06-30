import api from './api';

function unwrapList(response) {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.items || data?.products || data?.active_ingredients || [];
}

export const skincareService = {
  activeIngredients: async () => unwrapList(await api.get('/api/skincare/active-ingredients')),
  products: async (params = {}) => unwrapList(await api.get('/api/skincare/products', { params })),
  recommend: async (params = {}) => api.get('/api/skincare/recommend', { params }).then((r) => r.data),
};
