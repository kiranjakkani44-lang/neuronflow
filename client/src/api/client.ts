import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL || '';
const api = axios.create({
  baseURL: VITE_API_URL ? `${VITE_API_URL}/api` : '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
