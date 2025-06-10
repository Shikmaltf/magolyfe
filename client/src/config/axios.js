// frontend/src/config/axios.js
import axios from 'axios';
import { performLogout, isTokenStillValid } from '../utils/auth'; // Pastikan path ini benar

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!isTokenStillValid()) {
        // console.warn('Client-side check: Token expired. Logging out before sending request.');
        if (window.location.pathname !== '/login') { // Ganti '/login' jika path halaman login Anda berbeda
          performLogout('/login'); 
        }
        return Promise.reject(new Error('Token expired. Request cancelled by client.'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      // console.warn('Axios Interceptor: Received 401 Unauthorized.');
      const originalRequestUrl = error.config.url;
      const isLoginAttempt = originalRequestUrl && originalRequestUrl.includes('/api/admin/login'); // Sesuaikan dengan endpoint login Anda

      if (!isLoginAttempt && window.location.pathname !== '/login') {
        // console.log('Axios Interceptor: Not a login attempt and not on login page. Performing logout.');
        performLogout('/login'); 
      } else if (isLoginAttempt) {
        // console.log('Axios Interceptor: Login attempt failed (401). Error will be handled by the component.');
      } else {
        // console.log('Axios Interceptor: On login page, but not a login attempt. Check logic.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
