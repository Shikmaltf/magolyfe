// frontend/src/pages/Admin/ChangePassword.jsx
import React, { useState } from 'react';
import api from '../../config/axios'; // Instance Axios yang sudah dikonfigurasi
import { useNavigate } from 'react-router-dom'; // Untuk navigasi
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'; // Icon (opsional)

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [message, setMessage] = useState(''); // Untuk pesan sukses
  const [error, setError] = useState(''); // Untuk pesan error
  const [isLoading, setIsLoading] = useState(false); // Status loading
  
  const navigate = useNavigate(); // Hook untuk navigasi programatik

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah submit form default
    setError(''); // Reset error
    setMessage(''); // Reset message
    setIsLoading(true); // Set loading true

    // Validasi frontend dasar
    if (newPassword !== confirmNewPassword) {
      setError('Password baru dan konfirmasi password tidak cocok.');
      setIsLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('Password baru minimal harus 6 karakter.');
      setIsLoading(false);
      return;
    }

    try {
      // Panggil API untuk ubah password
      const response = await api.post('/api/admin/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      setMessage(response.data.message || 'Password berhasil diubah!');
      // Kosongkan field setelah sukses
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      // Opsional: Arahkan ke halaman lain atau tampilkan pesan lebih lama
      // setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      // Tangani error dari API
      setError(err.response?.data?.message || 'Gagal mengubah password. Silakan coba lagi.');
    } finally {
      setIsLoading(false); // Set loading false setelah selesai
    }
  };

  // Fungsi untuk toggle visibilitas password
  const togglePasswordVisibility = (setter) => {
    setter(prev => !prev);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 sm:p-8 bg-white rounded-xl shadow-2xl">
      <div className="flex flex-col items-center mb-6">
        <ShieldCheck size={48} className="text-green-600 mb-3" />
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Ubah Password Admin</h2>
      </div>

      {/* Tampilkan pesan sukses atau error */}
      {message && <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded-md shadow">{message}</div>}
      {error && <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-md shadow">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Password Saat Ini */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Password Saat Ini
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Masukkan password saat ini"
            />
            <button type="button" onClick={() => togglePasswordVisibility(setShowCurrentPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Input Password Baru */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Password Baru
          </label>
           <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Minimal 6 karakter"
            />
            <button type="button" onClick={() => togglePasswordVisibility(setShowNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Input Konfirmasi Password Baru */}
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              placeholder="Ulangi password baru"
            />
            <button type="button" onClick={() => togglePasswordVisibility(setShowConfirmNewPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700">
              {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        {/* Tombol Submit */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Ubah Password'}
          </button>
        </div>
      </form>
       <div className="mt-6 text-center">
        <button
            onClick={() => navigate('/admin')} // Kembali ke dashboard atau halaman admin utama
            className="text-sm text-green-600 hover:text-green-700 hover:underline"
        >
            Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
