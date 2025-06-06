// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import api from '../config/axios'; // Instance Axios
import { Link } from 'react-router-dom'; // Untuk link kembali ke Login
import { MailQuestion, KeyRound } from 'lucide-react'; // Icon (opsional)

const ForgotPassword = () => {
  const [username, setUsername] = useState(''); // State untuk username
  const [message, setMessage] = useState(''); // Pesan sukses
  const [error, setError] = useState(''); // Pesan error
  const [isLoading, setIsLoading] = useState(false); // Status loading

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah submit form default
    setError(''); // Reset error
    setMessage(''); // Reset message
    setIsLoading(true); // Set loading true

    if (!username) {
        setError('Username admin wajib diisi.');
        setIsLoading(false);
        return;
    }

    try {
      // Panggil API untuk lupa password
      const response = await api.post('/api/admin/forgot-password', { username });
      setMessage(response.data.message || 'Instruksi reset password telah dikirim.');
      setUsername(''); // Kosongkan field username setelah sukses
    } catch (err) {
      // Tangani error dari API
      setError(err.response?.data?.message || 'Gagal mengirim instruksi reset. Silakan coba lagi.');
    } finally {
      setIsLoading(false); // Set loading false setelah selesai
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <KeyRound size={48} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Lupa Password Admin</h1>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan username admin Anda. Jika akun ditemukan, instruksi reset akan dikirim ke email admin yang telah dikonfigurasi sebelumnya.
          </p>
        </div>

        {/* Tampilkan pesan sukses atau error */}
        {message && <div className="my-5 text-sm text-green-700 bg-green-100 p-3 rounded-md shadow">{message}</div>}
        {error && <div className="my-5 text-sm text-red-700 bg-red-100 p-3 rounded-md shadow">{error}</div>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="username_forgot" className="block text-sm font-medium text-gray-700 mb-1 sr-only"> 
                Username Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailQuestion className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    id="username_forgot"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Username Admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Kirim Instruksi Reset'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-green-600 hover:text-green-700 hover:underline">
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
