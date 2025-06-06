// frontend/src/pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Tambahkan useNavigate
import { Newspaper, ShoppingBag, BarChart3, LogOut, UserCog, ShieldAlert } from 'lucide-react'; // Tambahkan ikon baru
import api from '../../config/axios';
import { performLogout } from '../../utils/auth'; // Impor fungsi logout

// Fungsi untuk mengambil total artikel dari backend
const getTotalArticles = async () => {
  try {
    const response = await api.get('/api/admin/articles');
    return response.data.length;
  } catch (error) {
    console.error("Error fetching total articles:", error);
    return 0; // Kembalikan 0 jika error
  }
};

// Fungsi untuk mengambil total produk dari backend
const getTotalProducts = async () => {
  try {
    const response = await api.get('/api/admin/products');
    return response.data.length;
  } catch (error) {
    console.error("Error fetching total products:", error);
    return 0; // Kembalikan 0 jika error
  }
};

// Komponen untuk kartu statistik
const StatCard = ({ icon, title, value, bgColor = "bg-green-500", textColor = "text-white", linkTo }) => (
  <Link to={linkTo || '#'} className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${bgColor} ${textColor} transition-all duration-300 hover:scale-105 hover:shadow-xl block`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-medium opacity-90">{title}</p>
      {value === null ? ( // Tampilkan skeleton loading jika value masih null
        <div className="h-8 w-16 bg-gray-300 animate-pulse rounded-md mt-1"></div>
      ) : (
        <p className="text-3xl font-bold">{value}</p>
      )}
    </div>
  </Link>
);

const Dashboard = () => {
  const [totalArticles, setTotalArticles] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk logout
  const handleLogout = () => {
    performLogout('/login'); // Panggil fungsi logout dan arahkan ke halaman login
  };

  useEffect(() => {
    const fetchData = async () => {
      setTotalArticles(null); // Set ke null untuk memicu skeleton loading
      setTotalProducts(null);

      try {
        const articlesCount = await getTotalArticles();
        setTotalArticles(articlesCount);

        const productsCount = await getTotalProducts();
        setTotalProducts(productsCount);

      } catch (error) {
        console.error("Error in dashboard fetchData:", error);
        setTotalArticles(0); // Fallback jika ada error
        setTotalProducts(0); // Fallback jika ada error
      }
    };

    fetchData();
  }, []); // Efek ini hanya berjalan sekali saat komponen dimuat

  return (
    <div className="p-4 sm:p-6 min-h-[calc(100vh-var(--navbar-height,80px))] bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-4 sm:mb-0">
                <div className="flex items-center justify-center sm:justify-start">
                    <BarChart3 size={40} className="text-green-600 mr-3" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Dashboard Admin</h1>
                </div>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">Selamat datang! Kelola konten dan lihat statistik website Anda.</p>
            </div>
            {/* Tombol Logout dan Ubah Password */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Link
                    to="/admin/change-password"
                    className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                    title="Ubah Password Anda"
                >
                    <UserCog size={18} className="mr-2" />
                    Ubah Password
                </Link>
            </div>
          </div>
        </header>

        {/* Bagian Statistik */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-12">
          <StatCard
            icon={<Newspaper size={36} />}
            title="Total Artikel"
            value={totalArticles}
            bgColor="bg-sky-500 hover:bg-sky-600"
            linkTo="/admin/articles"
          />
          <StatCard
            icon={<ShoppingBag size={36} />}
            title="Total Produk"
            value={totalProducts}
            bgColor="bg-amber-500 hover:bg-amber-600"
            linkTo="/admin/products"
          />
        </section>

        {/* Bagian Link Manajemen */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 text-center border-b pb-4">
            Akses Cepat Pengelolaan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link
              to="/admin/articles"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
            >
              <Newspaper size={22} className="mr-2.5" />
              Kelola Artikel
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
            >
              <ShoppingBag size={22} className="mr-2.5" />
              Kelola Produk
            </Link>
            {/* Contoh link lain jika ada */}
            {/* <Link
              to="/admin/settings" // Ganti dengan rute yang sesuai
              className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
            >
              <ShieldAlert size={22} className="mr-2.5" />
              Pengaturan Lainnya
            </Link> */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
