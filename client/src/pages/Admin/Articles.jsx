// frontend/src/pages/Admin/Articles.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { Edit3, Trash2, PlusCircle, ArrowLeft, Image as ImageIcon, Youtube as YoutubeIcon } from 'lucide-react';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchArticles = () => {
    console.log('Admin/Articles.jsx: Fetching articles from API_BASE_URL:', API_BASE_URL);
    // Pastikan backend mengirim 'updatedAt' untuk setiap artikel
    api.get('/api/admin/articles') 
      .then(res => {
        console.log('Admin/Articles.jsx: Articles fetched successfully for admin:', res.data);
        setArticles(res.data);
      })
      .catch(err => {
        console.error("Admin/Articles.jsx: Error fetching articles for admin:", err);
        // Ganti alert dengan notifikasi yang lebih baik jika memungkinkan
        alert("Gagal memuat artikel.");
      });
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async id => {
    // Ganti window.confirm dengan modal konfirmasi yang lebih baik jika memungkinkan
    if (window.confirm('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat diurungkan.')) {
      try {
        console.log(`Admin/Articles.jsx: Attempting to delete article with id: ${id}`);
        await api.delete(`/api/admin/articles/${id}`);
        console.log(`Admin/Articles.jsx: Article with id: ${id} deleted successfully.`);
        fetchArticles(); 
      } catch (err) {
        console.error(`Admin/Articles.jsx: Gagal menghapus artikel dengan id: ${id}:`, err);
        alert(`Gagal menghapus artikel: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">Kelola Artikel</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/admin"
              className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Dashboard
            </Link>
            <Link
              to="/admin/articles/new"
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <PlusCircle size={18} className="mr-2" />
              Tambah Artikel Baru
            </Link>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Belum ada artikel yang ditambahkan.</p>
            <p className="text-gray-400 text-sm mt-2">Klik "Tambah Artikel Baru" untuk memulai.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Gambar</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Judul</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">Isi (Cuplikan)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Video</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map(article => {
                  console.log('Admin/Articles.jsx: Processing article for table:', { id: article._id, hasImage: article.hasImage, title: article.title, updatedAt: article.updatedAt });
                  let imageUrl = '';
                  if (article.hasImage) {
                    const baseUrl = `${API_BASE_URL}/api/articles/${article._id}/image`;
                    if (article.updatedAt) {
                      const timestamp = new Date(article.updatedAt).getTime();
                      if (!isNaN(timestamp)) {
                        imageUrl = `${baseUrl}?v=${timestamp}`;
                      } else {
                        imageUrl = baseUrl;
                         console.warn(`Admin/Articles.jsx: Invalid updatedAt for article ${article._id} in table, using URL without versioning.`);
                      }
                    } else {
                      imageUrl = baseUrl;
                      console.warn(`Admin/Articles.jsx: Missing updatedAt for article ${article._id} in table, using URL without versioning.`);
                    }
                  }
                  if(article.hasImage && imageUrl) {
                      console.log('Admin/Articles.jsx: Constructed Image URL for table:', imageUrl);
                  }
                  return (
                    <tr key={article._id} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {article.hasImage && imageUrl ? (
                          <img
                              src={imageUrl}
                              alt={article.title || 'Gambar Artikel'}
                              className="h-12 w-16 object-cover rounded-md shadow-sm"
                              onError={(e) => {
                                console.error(`Admin/Articles.jsx: Error loading image for article ${article._id} in table:`, imageUrl, e);
                                e.target.alt = 'Gagal memuat gambar';
                                // e.target.src = 'https://placehold.co/64x48/EEE/CCC?text=Error';
                              }}
                          />
                        ) : (
                          <div className="h-12 w-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                            <ImageIcon size={24} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900 max-w-xs">
                          {/* PERUBAHAN DI SINI: Menghapus /edit dari path */}
                          <Link to={`/admin/articles/${article._id}`} className="hover:text-green-600">{article.title}</Link>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-600 hidden md:table-cell max-w-sm">
                        {article.content ? `${article.content.substring(0, 70)}...` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {article.youtubeVideoId ? (
                          <a href={`https://www.youtube.com/watch?v=${article.youtubeVideoId}`} target="_blank" rel="noopener noreferrer" title="Lihat Video di YouTube">
                            <YoutubeIcon size={24} className="text-red-600 hover:text-red-700" />
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button
                          // PERUBAHAN DI SINI: Menghapus /edit dari path
                          onClick={() => navigate(`/admin/articles/${article._id}`)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-md hover:bg-blue-100"
                          title="Edit Artikel"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(article._id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-100"
                          title="Hapus Artikel"
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

export default Articles;
