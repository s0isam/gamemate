import axios from 'axios';
import { resolveBackendUrl } from './backendUrl';

const apiBaseUrl = resolveBackendUrl(import.meta.env.VITE_API_URL, 5000, '/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gamemate_token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default api;
