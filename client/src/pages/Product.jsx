// frontend/src/pages/Product.jsx
import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { ShoppingBag, Youtube, Package, DollarSign } from 'lucide-react';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER;

  useEffect(() => {
    console.log('Product.jsx: Fetching products from API_BASE_URL:', API_BASE_URL);
    // Pastikan backend mengirim 'updatedAt' untuk setiap produk
    api.get('/api/products')
      .then(res => {
        console.log('Product.jsx: Products fetched successfully:', res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Product.jsx: Error fetching products:", err);
        setError('Tidak dapat memuat produk saat ini. Silakan coba lagi nanti.');
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100 flex flex-col justify-center items-center text-center px-4">
        <Package size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Terjadi Kesalahan</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <ShoppingBag size={64} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
            Produk Unggulan Kami
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Jelajahi berbagai produk berkualitas dari Magolyfe yang mendukung gaya hidup sehat dan berkelanjutan Anda.
          </p>
        </header>

        {products.length === 0 ? (
           <div className="text-center py-10">
             <Package size={48} className="mx-auto text-gray-400 mb-4" />
             <p className="text-gray-500 text-xl">Belum ada produk yang tersedia.</p>
             <p className="text-gray-400 mt-2">Nantikan koleksi produk kami segera!</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {products.map(product => {
              console.log('Product.jsx: Processing product:', { id: product._id, hasImage: product.hasImage, name: product.name, updatedAt: product.updatedAt });
              let imageUrl = '';
              if (product.hasImage) {
                const baseUrl = `${API_BASE_URL}/api/products/${product._id}/image`;
                if (product.updatedAt) {
                  const timestamp = new Date(product.updatedAt).getTime();
                  if (!isNaN(timestamp)) {
                    imageUrl = `${baseUrl}?v=${timestamp}`;
                  } else {
                    imageUrl = baseUrl;
                    console.warn(`Product.jsx: Invalid updatedAt for product ${product._id}, using URL without versioning.`);
                  }
                } else {
                  imageUrl = baseUrl;
                  console.warn(`Product.jsx: Missing updatedAt for product ${product._id}, using URL without versioning.`);
                }
              }
              if(product.hasImage && imageUrl) {
                  console.log('Product.jsx: Constructed Image URL:', imageUrl);
              }

              return (
                <div key={product._id} className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03]">
                  {product.hasImage && imageUrl && (
                    <div className="w-full h-64 overflow-hidden">
                      <img
                          src={imageUrl}
                          alt={product.name || 'Gambar Produk'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            console.error(`Product.jsx: Error loading image for product ${product._id}:`, imageUrl, e);
                            e.target.alt = 'Gagal memuat gambar produk';
                            // e.target.src = 'https://placehold.co/600x400/EEE/CCC?text=Gagal+Muat';
                          }}
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-green-700 mb-2 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-grow">
                      {product.description ? `${product.description.substring(0, 100)}...` : 'Deskripsi tidak tersedia.'}
                    </p>

                    {product.youtubeVideoId && (
                      <div className="my-3">
                         <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden shadow-md">
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${product.youtubeVideoId}`}
                            title={product.name || 'Video Produk'}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                          <p className="text-xl font-bold text-green-600">
                          {formatPrice(product.price)}
                          </p>
                          <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Saya ingin membeli ${product.name}, apakah masih tersedia?`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all text-sm text-center"
                        >
                            Beli
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
