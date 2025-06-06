// src/utils/auth.js
import { jwtDecode } from 'jwt-decode';
// import api from './config/axios'; // Uncomment jika Anda ingin menghapus header default Axios di sini

/**
 * Mendekode token JWT untuk mendapatkan payload-nya.
 * @param {string} token - Token JWT.
 * @returns {object|null} Payload token atau null jika terjadi error.
 */
export const parseJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
};

/**
 * Melakukan logout pengguna (dipanggil secara manual atau otomatis).
 * Membersihkan token, tokenExpiry, dan mengarahkan pengguna.
 * @param {string} redirectTo - Path untuk redirect setelah logout. Default ke '/login'.
 */
export const performLogout = (redirectTo = '/login') => {
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExpiry');
  
  // Opsional: Hapus header Authorization default dari instance Axios
  // Ini berguna jika Anda men-set-nya secara global pada instance Axios.
  // Pastikan 'api' adalah instance axios yang diekspor dari config Anda.
  // delete api.defaults.headers.common['Authorization'];
  
  console.log(`User logged out. Redirecting to ${redirectTo}`);
  window.location.href = redirectTo;
};


/**
 * Memeriksa apakah token saat ini masih valid berdasarkan waktu kedaluwarsa yang disimpan.
 * @returns {boolean} True jika token ada dan belum kedaluwarsa, false jika sebaliknya.
 */
export const isTokenStillValid = () => {
  const token = localStorage.getItem('token');
  const expiryTime = localStorage.getItem('tokenExpiry');

  if (!token || !expiryTime) {
    return false;
  }
  return Date.now() < parseInt(expiryTime, 10);
};
