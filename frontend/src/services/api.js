import axios from 'axios';
import useStore from '../store/useStore';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, logout user
      const { logout } = useStore.getState();
      logout();
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(error);
  }
);

// Offline handler
let isOffline = false;
window.addEventListener('offline', () => {
  isOffline = true;
  useStore.getState().setOnline(false);
});

window.addEventListener('online', () => {
  isOffline = false;
  useStore.getState().setOnline(true);
});

// Wrapper for requests with offline handling
const request = async (method, url, data = null, config = {}) => {
  if (!navigator.onLine && method === 'post') {
    // Save offline actions
    const { user } = useStore.getState();
    if (user) {
      const pendingAction = {
        type: method.toUpperCase(),
        url,
        data,
        created_at: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('pending_actions') || '[]');
      existing.push(pendingAction);
      localStorage.setItem('pending_actions', JSON.stringify(existing));
    }
    return { data: null, offline: true };
  }

  return api({ method, url, data, ...config });
};

export default api;
export { request };