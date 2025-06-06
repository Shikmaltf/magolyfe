// frontend/src/pages/ResetPassword.jsx
import React, { useState, useEffect } from 'react';
import api from '../config/axios'; // Instance Axios
import { useParams, useNavigate, Link } from 'react-router-dom'; // Hooks dari react-router-dom
import { KeyIcon, Eye, EyeOff, CheckCircle } from 'lucide-react'; // Icon (opsional)

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState(''); // Pesan sukses
  const [error, setError] = useState(''); // Pesan error
  const [isLoading, setIsLoading] = useState(false); // Status loading
  
  const { token } = useParams(); // Mengambil token dari URL parameter
  const navigate = useNavigate(); // Hook untuk navigasi programatik

  useEffect(() => {
    if (!token) {
        setError('Token reset tidak ditemukan. Pastikan Anda menggunakan link yang benar dari email.');
    }
  }, [token]);


  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah submit form default
    setError(''); // Reset error
    setMessage(''); // Reset message
    
    // Validasi frontend
    if (!token) {
        setError('Token reset tidak valid atau hilang. Silakan coba minta link reset baru.');
        return;
    }
    if (password !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 6) {
      setError('Password baru minimal harus 6 karakter.');
      return;
    }
    
    setIsLoading(true); // Set loading true
    try {
      // Panggil API untuk reset password dengan token
      const response = await api.post(`/api/admin/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      setMessage(response.data.message || 'Password berhasil direset!');
      setPassword(''); // Kosongkan field
      setConfirmPassword(''); // Kosongkan field
      // Arahkan ke halaman login setelah beberapa detik
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      // Tangani error dari API
      setError(err.response?.data?.message || 'Gagal mereset password. Token mungkin tidak valid atau sudah kedaluwarsa.');
    } finally {
      setIsLoading(false); // Set loading false setelah selesai
    }
  };

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = (setter) => {
    setter(prev => !prev);
  };

  // Div terluar sebelumnya yang memiliki bg-gray-100 dan flex centering dihilangkan.
  // Div ini sekarang menjadi root component dan akan ditempatkan di dalam <main> dari App.jsx.
  // mx-auto akan membuatnya terpusat secara horizontal di dalam container App.jsx.
  // my-12 (margin atas-bawah) ditambahkan untuk spasi vertikal.
  return (
    <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-2xl mx-auto my-12 sm:my-16 lg:my-20">
      <div className="text-center">
        <KeyIcon size={48} className="mx-auto text-green-600 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Reset Password Anda</h1>
      </div>

      {/* Tampilkan pesan sukses atau error */}
      {message && (
        <div className="my-5 text-sm text-green-700 bg-green-100 p-4 rounded-md shadow flex items-center">
          <CheckCircle size={20} className="mr-2 text-green-600" />
          <div>
              {message} <br /> Anda akan diarahkan ke halaman login...
          </div>
        </div>
      )}
      {error && <div className="my-5 text-sm text-red-700 bg-red-100 p-3 rounded-md shadow">{error}</div>}
      
      {/* Form hanya ditampilkan jika belum ada pesan sukses */}
      {!message && (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Input Password Baru */}
          <div className="rounded-md shadow-sm space-y-5">
            <div>
              <label htmlFor="password_reset_page" className="block text-sm font-medium text-gray-700 mb-1">
                Password Baru
              </label>
              <div className="relative">
                  <input
                  id="password_reset_page"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Masukkan password baru (min. 6 karakter)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => togglePasswordVisibility(setShowPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
              </div>
            </div>
            {/* Input Konfirmasi Password Baru */}
            <div>
              <label htmlFor="confirmPassword_reset_page" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                  <input
                  id="confirmPassword_reset_page"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Ulangi password baru Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => togglePasswordVisibility(setShowConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !token} // Disable jika loading atau tidak ada token
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : 'Reset Password'}
            </button>
          </div>
        </form>
      )}
      <div className="text-sm text-center mt-6">
        <Link to="/login" className="font-medium text-green-600 hover:text-green-700 hover:underline">
          Kembali ke Halaman Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
