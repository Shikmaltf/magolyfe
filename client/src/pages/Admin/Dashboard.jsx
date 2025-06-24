import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Newspaper, ShoppingBag, BarChart3, MessageSquareQuote, UserCog } from 'lucide-react'; // Added MessageSquareQuote
import api from '../../config/axios';
import { performLogout } from '../../utils/auth'; 

const getTotalArticles = async () => {
  try {
    const response = await api.get('/api/admin/articles');
    return response.data.length;
  } catch (error) {
    console.error("Error fetching total articles:", error);
    return 0;
  }
};

const getTotalProducts = async () => {
  try {
    const response = await api.get('/api/admin/products');
    return response.data.length;
  } catch (error) {
    console.error("Error fetching total products:", error);
    return 0;
  }
};

// Fungsi untuk mengambil total ulasan
const getTotalReviews = async () => {
  try {
    const response = await api.get('/api/reviews'); // Gunakan endpoint ulasan
    return response.data.length;
  } catch (error) {
    console.error("Error fetching total reviews:", error);
    return 0;
  }
};

const StatCard = ({ icon, title, value, bgColor = "bg-green-500", textColor = "text-white", linkTo }) => (
  <Link to={linkTo || '#'} className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 ${bgColor} ${textColor} transition-all duration-300 hover:scale-105 hover:shadow-xl block`}>
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <p className="text-sm font-medium opacity-90">{title}</p>
      {value === null ? (
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
  const [totalReviews, setTotalReviews] = useState(null); // State untuk total ulasan
  const navigate = useNavigate();

  const handleLogout = () => {
    performLogout('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      setTotalArticles(null);
      setTotalProducts(null);
      setTotalReviews(null); // Reset state ulasan

      try {
        const articlesCount = await getTotalArticles();
        setTotalArticles(articlesCount);

        const productsCount = await getTotalProducts();
        setTotalProducts(productsCount);

        const reviewsCount = await getTotalReviews(); // Panggil fungsi untuk mengambil jumlah ulasan
        setTotalReviews(reviewsCount);

      } catch (error) {
        console.error("Error in dashboard fetchData:", error);
        setTotalArticles(0);
        setTotalProducts(0);
        setTotalReviews(0); // Fallback
      }
    };

    fetchData();
  }, []);

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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12">
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
          <StatCard
            icon={<MessageSquareQuote size={36} />}
            title="Total Ulasan"
            value={totalReviews}
            bgColor="bg-teal-500 hover:bg-teal-600"
            linkTo="/admin/reviews"
          />
        </section>

        {/* Bagian Link Manajemen */}
        <section className="bg-white p-6 sm:p-8 rounded-xl shadow-xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 text-center border-b pb-4">
            Akses Cepat Pengelolaan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
            <Link
              to="/admin/reviews"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-base sm:text-lg"
            >
              <MessageSquareQuote size={22} className="mr-2.5" />
              Kelola Ulasan
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
