// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Komponen Umum
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute'; // Komponen untuk rute privat

// Halaman Publik
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Education from './pages/Education';
import Gallery from './pages/Gallery';
import Product from './pages/Product';

// Halaman Autentikasi & Reset Password
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword'; // Halaman baru
import ResetPassword from './pages/ResetPassword';   // Halaman baru

// Halaman Admin (Diproteksi)
import Dashboard from './pages/Admin/Dashboard';
import Articles from './pages/Admin/Articles';
import Products from './pages/Admin/Products';
import ArticleForm from './components/ArticleForm'; // Biasanya di folder components atau pages/Admin
import ProductForm from './components/ProductForm'; // Biasanya di folder components atau pages/Admin
import ChangePassword from './pages/Admin/ChangePassword'; // Halaman baru untuk admin


function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar tampil di semua halaman */}
      <main className="container mx-auto px-4 py-4 min-h-[calc(100vh-var(--navbar-height,64px))]"> {/* Sesuaikan --navbar-height jika ada */}
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/education" element={<Education />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />

          {/* Rute Autentikasi & Reset Password (Publik) */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Rute baru */}
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* Rute baru dengan parameter token */}


          {/* Rute Admin (Diproteksi oleh PrivateRoute) */}
          {/* Semua rute di bawah ini memerlukan login */}
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} /> {/* Rute baru */}
          
          <Route path="/admin/articles" element={<PrivateRoute><Articles /></PrivateRoute>} />
          <Route path="/admin/articles/new" element={<PrivateRoute><ArticleForm /></PrivateRoute>} />
          <Route path="/admin/articles/:id" element={<PrivateRoute><ArticleForm /></PrivateRoute>} /> {/* Untuk edit artikel */}
          
          <Route path="/admin/products" element={<PrivateRoute><Products /></PrivateRoute>} />
          <Route path="/admin/products/new" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
          <Route path="/admin/products/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} /> {/* Untuk edit produk */}
          

          {/* Fallback Route: Jika tidak ada rute yang cocok, arahkan ke HomePage */}
          {/* Pastikan ini adalah rute terakhir */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
