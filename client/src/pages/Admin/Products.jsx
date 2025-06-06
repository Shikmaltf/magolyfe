// frontend/src/pages/Admin/Products.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Edit3, Trash2, PlusCircle, ArrowLeft, Package, Youtube as YoutubeIcon, Image as ImageIcon } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL =process.env.REACT_APP_API_BASE_URL;

  const fetchProducts = () => {
    console.log('Admin/Products.jsx: Fetching products from API_BASE_URL:', API_BASE_URL);
    // Pastikan backend mengirim 'updatedAt' untuk setiap produk
    api.get('/api/admin/products')
      .then(res => {
        console.log('Admin/Products.jsx: Products fetched successfully for admin:', res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error("Admin/Products.jsx: Error fetching products for admin:", err);
        alert("Gagal memuat produk.");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat diurungkan.')) {
      try {
        console.log(`Admin/Products.jsx: Attempting to delete product with id: ${id}`);
        await api.delete(`/api/admin/products/${id}`);
        console.log(`Admin/Products.jsx: Product with id: ${id} deleted successfully.`);
        fetchProducts();
      } catch (err) {
        console.error(`Admin/Products.jsx: Gagal menghapus produk dengan id: ${id}:`, err);
        alert(`Gagal menghapus produk: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Kelola Produk</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/admin"
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Dashboard
            </Link>
            <Link
              to="/admin/products/new"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <PlusCircle size={18} className="mr-2" />
              Tambah Produk Baru
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Belum ada produk yang ditambahkan.</p>
            <p className="text-gray-400 text-sm mt-2">Klik "Tambah Produk Baru" untuk memulai.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gambar</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama Produk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Deskripsi (Cuplikan)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Harga</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Video</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map(product => {
                  console.log('Admin/Products.jsx: Processing product for table:', { id: product._id, hasImage: product.hasImage, name: product.name, updatedAt: product.updatedAt });
                  let imageUrl = '';
                  if (product.hasImage) {
                    const baseUrl = `${API_BASE_URL}/api/products/${product._id}/image`;
                    if (product.updatedAt) {
                      const timestamp = new Date(product.updatedAt).getTime();
                      if (!isNaN(timestamp)) {
                        imageUrl = `${baseUrl}?v=${timestamp}`;
                      } else {
                        imageUrl = baseUrl;
                        console.warn(`Admin/Products.jsx: Invalid updatedAt for product ${product._id} in table, using URL without versioning.`);
                      }
                    } else {
                      imageUrl = baseUrl;
                      console.warn(`Admin/Products.jsx: Missing updatedAt for product ${product._id} in table, using URL without versioning.`);
                    }
                  }
                  if(product.hasImage && imageUrl) {
                      console.log('Admin/Products.jsx: Constructed Image URL for table:', imageUrl);
                  }
                  return (
                    <tr key={product._id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.hasImage && imageUrl ? (
                          <img
                              src={imageUrl}
                              alt={product.name || 'Gambar Produk'}
                              className="h-12 w-12 object-cover rounded-md shadow-sm"
                              onError={(e) => {
                                console.error(`Admin/Products.jsx: Error loading image for product ${product._id} in table:`, imageUrl, e);
                                e.target.alt = 'Gagal memuat gambar';
                                // e.target.src = 'https://placehold.co/48x48/EEE/CCC?text=Error';
                              }}
                          />
                        ) : (
                           <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                          {/* PERUBAHAN DI SINI: Menghapus /edit dari path */}
                          <Link to={`/admin/products/${product._id}`} className="hover:text-green-600">{product.name}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 hidden md:table-cell max-w-sm">
                        {product.description ? `${product.description.substring(0, 70)}...` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {product.youtubeVideoId ? (
                           <a href={`https://www.youtube.com/watch?v=${product.youtubeVideoId}`} target="_blank" rel="noopener noreferrer" title="Lihat Video Produk di YouTube">
                              <YoutubeIcon size={24} className="text-red-600 hover:text-red-700" />
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          // PERUBAHAN DI SINI: Menghapus /edit dari path
                          onClick={() => navigate(`/admin/products/${product._id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-100"
                          title="Edit Produk"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-100"
                          title="Hapus Produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
