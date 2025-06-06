// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import api from '../config/axios';
import { useNavigate, Link } from 'react-router-dom'; // Tambahkan Link
import { parseJwt, isTokenStillValid } from '../utils/auth';
import { LogInIcon, AlertTriangle } from 'lucide-react'; // Icon

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenStillValid()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setShowErrorModal(false);
    setIsLoading(true);
    
    try {
      const res = await api.post('/api/admin/login', { username, password });
      const { token } = res.data;

      if (token) {
        localStorage.setItem('token', token);
        const decodedToken = parseJwt(token);
        if (decodedToken && decodedToken.exp) {
          const expiryTime = decodedToken.exp * 1000;
          localStorage.setItem('tokenExpiry', expiryTime.toString());
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          navigate('/admin');
        } else {
          setError('Token diterima tidak valid.');
          setShowErrorModal(true);
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
        }
      } else {
        setError('Token tidak diterima dari server.');
        setShowErrorModal(true);
      }
    } catch (err) {
      let errMsg = 'Terjadi kesalahan saat mencoba login.';
      if (err.response) {
        if (err.response.status === 401) {
          errMsg = 'Pastikan username dan/atau password yang Anda masukkan sudah benar.';
        } else if (err.response.data?.message) {
          errMsg = err.response.data.message;
        } else {
          errMsg = `Error ${err.response.status}: Terjadi kesalahan pada server.`;
        }
      } else if (err.request) {
        errMsg = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
      }
      setError(errMsg);
      setShowErrorModal(true);
    } finally {
        setIsLoading(false);
    }
  };

  const closeErrorModal = () => setShowErrorModal(false);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        {/* Modal Error */}
        {showErrorModal && error && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modalShow">
                    <div className="flex items-start mb-4">
                        <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                            <AlertTriangle className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">Terjadi Kesalahan</h3>
                            <p className="text-sm text-gray-600 mt-1">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={closeErrorModal}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                    >
                        OK
                    </button>
                </div>
            </div>
        )}

        <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-2xl">
            <div className="text-center">
                <LogInIcon size={48} className="mx-auto text-green-600 mb-4" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">Admin Login</h1>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm space-y-5">
                    <div>
                        <label htmlFor="username_login" className="sr-only">Username</label>
                        <input
                            id="username_login"
                            name="username"
                            type="text"
                            autoComplete="username" 
                            required
                            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Username Admin"
                            value={username}
                            onChange={handleUsernameChange} 
                        />
                    </div>
                    <div>
                        <label htmlFor="password_login" className="sr-only">Password</label>
                        <input
                            id="password_login"
                            name="password"
                            type="password"
                            autoComplete="current-password" 
                            required
                            className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange} 
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end text-sm">
                    {/* Link Lupa Password */}
                    <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-700 hover:underline">
                        Lupa password?
                    </Link>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Login'}
                    </button>
                </div>
            </form>
        </div>
        {/* CSS untuk animasi modal (bisa diletakkan di file CSS global atau <style> di App.jsx) */}
        <style jsx global>{`
            @keyframes modalShowAnimation {
                0% { transform: scale(0.95); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
            .animate-modalShow {
                animation: modalShowAnimation 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default Login;
