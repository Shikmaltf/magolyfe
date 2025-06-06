// frontend/src/pages/Gallery.jsx
import React, { useEffect, useState } from 'react';
import api from '../config/axios';
import { BookOpen, Newspaper, Youtube, Calendar, X, ExternalLink } from 'lucide-react';

const Gallery = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null); // State for the article to show in modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    console.log('Gallery.jsx: Fetching articles from API_BASE_URL:', API_BASE_URL);
    api.get('/api/articles')
      .then(res => {
        console.log('Gallery.jsx: Articles fetched successfully:', res.data);
        setArticles(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Gallery.jsx: Error fetching articles for gallery:", err);
        setError('Tidak dapat memuat artikel saat ini. Silakan coba lagi nanti.');
        setLoading(false);
      });
  }, [API_BASE_URL]); // Removed API_BASE_URL from dependencies as it's a constant string

  // Function to open the modal
  const openModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedArticle(null);
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore background scrolling
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
        <BookOpen size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Oops! Terjadi Kesalahan</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <Newspaper size={64} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
            Galeri Kegiatan
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Temukan informasi terbaru dan kegiatan inspiratif dari KSM Watesa Jamaras 02
          </p>
        </header>

        {articles.length === 0 ? (
          <div className="text-center py-10">
            <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-xl">Belum ada artikel yang dipublikasikan.</p>
            <p className="text-gray-400 mt-2">Silakan kembali lagi nanti!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => {
              let imageUrl = '';
              if (article.hasImage) {
                const baseUrl = `${API_BASE_URL}/api/articles/${article._id}/image`;
                if (article.updatedAt) {
                  const timestamp = new Date(article.updatedAt).getTime();
                  imageUrl = !isNaN(timestamp) ? `${baseUrl}?v=${timestamp}` : baseUrl;
                } else {
                  imageUrl = baseUrl;
                }
              }

              return (
                <div key={article._id} className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group">
                  {article.hasImage && imageUrl && (
                    <div className="w-full h-56 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={article.title || 'Gambar Artikel'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          console.error(`Gallery.jsx: Error loading image for article ${article._id}:`, imageUrl, e);
                          e.target.alt = 'Gagal memuat gambar artikel';
                          // e.target.src = 'https://placehold.co/600x400/EEE/CCC?text=Gagal+Muat'; // Placeholder
                        }}
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-2xl font-bold text-green-700 mb-3 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h2>
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                      <Calendar size={14} /> <span>{new Date(article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {article.content ? `${article.content.substring(0, 150)}...` : 'Konten tidak tersedia.'}
                    </p>
                    
                    {/* "Lihat Detail" Button */}
                    <button
                      onClick={() => openModal(article)}
                      className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                    >
                      <BookOpen size={18} />
                      <span>Lihat Detail</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for displaying full article */}
      {isModalOpen && selectedArticle && (
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
              <X size={28} />
            </button>
            
            <h2 className="text-3xl font-bold text-green-700 mb-4 pr-10">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center text-sm text-gray-500 mb-6 space-x-2">
              <Calendar size={16} /> 
              <span>Diterbitkan pada: {new Date(selectedArticle.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>

            {selectedArticle.hasImage && (
              <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden mb-6 shadow-md">
                <img
                  src={`${API_BASE_URL}/api/articles/${selectedArticle._id}/image?v=${new Date(selectedArticle.updatedAt || selectedArticle.createdAt).getTime()}`}
                  alt={selectedArticle.title || 'Gambar Artikel'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.alt = 'Gagal memuat gambar artikel';
                    // e.target.src = 'https://placehold.co/800x400/EEE/CCC?text=Gagal+Muat';
                  }}
                />
              </div>
            )}
            
            {/* Full Article Content */}
            <div 
                className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content || 'Konten tidak tersedia.' }} 
            />


            {selectedArticle.youtubeVideoId && (
              <div className="my-6">
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Video Terkait:</h4>
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedArticle.youtubeVideoId}`}
                    title={selectedArticle.title || 'Video Artikel'}
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

export default Gallery;
