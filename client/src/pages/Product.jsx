// frontend/src/pages/Product.jsx
import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { ShoppingBag, Youtube, Package, DollarSign, BookOpen } from 'lucide-react';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // State for the product to show in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
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

 // Function to open the modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };

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
                    {/* Deskripsi singkat di kartu produk */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {product.description ? `${product.description.substring(0, 150)}${product.description.length > 150 ? '...' : ''}` : 'Deskripsi tidak tersedia.'}
                    </p>

                    {/* Tombol "Lihat Detail" di atas harga dan tombol beli */}
                    <button
                       onClick={() => openModal(product)}
                       className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2 mb-4"
                       >
                      <BookOpen size={18} />
                      <span>Lihat Detail</span>
                    </button>

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
      {/* Modal for displaying full product */}
            {isModalOpen && selectedProduct && (
              <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
                  onClick={closeModal} // Close modal on overlay click
              >
                <div
                  className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative animate-modalShow"
                  onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal content
                >
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
                    aria-label="Tutup modal"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <h2 className="text-3xl font-bold text-green-700 mb-4 pr-10">
                    {selectedProduct.name} {/* Menggunakan product.name untuk judul */}
                  </h2>


                  {selectedProduct.hasImage && (
                    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 shadow-md">
                      <img
                        src={`${API_BASE_URL}/api/products/${selectedProduct._id}/image?v=${new Date(selectedProduct.updatedAt || selectedProduct.createdAt).getTime()}`}
                        alt={selectedProduct.name || 'Gambar Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.alt = 'Gagal memuat gambar product';
                          // e.target.src = 'https://placehold.co/800x400/EEE/CCC?text=Gagal+Muat';
                        }}
                      />
                    </div>
                  )}

                  {/* Full Product Description - Use product.description for full text */}
                  <div
                      className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed mb-6"
                      dangerouslySetInnerHTML={{ __html: selectedProduct.description || 'Deskripsi tidak tersedia.' }}
                  />


                  {selectedProduct.youtubeVideoId && (
                    <div className="my-6">
                      <h4 className="text-xl font-semibold text-gray-800 mb-3">Video Terkait:</h4>
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${selectedProduct.youtubeVideoId}`}
                          title={selectedProduct.name || 'Video Produk'}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          referrerPolicy="strict-origin-when-cross-origin"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                      <button
                          onClick={closeModal}
                          className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors duration-300"
                      >
                          Tutup
                      </button>
                  </div>
                </div>
              </div>
            )}
            {/* Add some CSS for modal animation if you don't have it globally */}
            <style jsx global>{`
              .animate-modalShow {
                animation: modalShow 0.3s ease-out forwards;
              }
              @keyframes modalShow {
                from {
                  opacity: 0;
                  transform: scale(0.9) translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              /* Ensure prose styles apply correctly for content */
              .prose img {
                  margin-top: 1em;
                  margin-bottom: 1em;
                  border-radius: 0.5rem; /* rounded-lg */
              }
              .prose p {
                  margin-top: 0.5em;
                  margin-bottom: 0.5em;
              }
              .prose h1, .prose h2, .prose h3, .prose h4 {
                  margin-top: 1.2em;
                  margin-bottom: 0.6em;
                  color: #15803d; /* green-700 */
              }
            `}</style>
    </div>
  );
};

export default Product;