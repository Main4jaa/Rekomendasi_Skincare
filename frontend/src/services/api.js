import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL;
const baseURL = rawBaseUrl && rawBaseUrl.trim() ? rawBaseUrl.trim() : '';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject('Backend belum berjalan atau tidak bisa diakses. Pastikan backend menyala di http://127.0.0.1:8000, lalu refresh halaman.');
    }
    const detail = error?.response?.data?.detail;
    if (Array.isArray(detail)) {
      return Promise.reject(detail.map((item) => item.msg || JSON.stringify(item)).join(', '));
    }
    return Promise.reject(detail || error.message || 'Terjadi kesalahan API');
  },
);

export default api;
