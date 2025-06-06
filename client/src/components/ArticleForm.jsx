// frontend/src/components/ArticleForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../config/axios';
import { ArrowLeft, UploadCloud, Youtube, Trash2, ImagePlus } from 'lucide-react'; // Tambahkan ImagePlus

const ArticleForm = () => {
  const { id } = useParams();
  console.log(`ArticleForm.jsx: Component mounted. ID from useParams: ${id}`);

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [initialImageExists, setInitialImageExists] = useState(false);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentArticleIdForEffect, setCurrentArticleIdForEffect] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const isEditing = !!id;

  const getYouTubeVideoId = useCallback((url) => {
    if (!url) return '';
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|user\/\S+\/playlist\/\S+\?list=|user\/\S+\#p\/\S+\/|attribution_link\?a=\S+&u=\S+\/watch%3Fv%3D|oembed\?url=https?%3A\/\/www\.youtube\.com\/watch%3Fv%3D|get_video_info\?video_id=)([^#&?]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^#&?]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    try {
        const parsedUrl = new URL(url);
        const videoId = parsedUrl.searchParams.get('v') || parsedUrl.searchParams.get('video_id');
        if (videoId && videoId.length === 11) {
            return videoId;
        }
    } catch (e) {
        // Abaikan error
    }
    console.warn("ArticleForm.jsx: Could not extract YouTube Video ID from URL:", url);
    return '';
  }, []);

  useEffect(() => {
    console.log(`ArticleForm.jsx: useEffect triggered. ID: ${id}, isEditing: ${isEditing}, currentArticleIdForEffect: ${currentArticleIdForEffect}`);
    if (id && id !== currentArticleIdForEffect) {
        setCurrentArticleIdForEffect(id);
        setIsLoading(true);
        api.get(`/api/admin/articles/${id}`)
            .then(res => {
                if (id === currentArticleIdForEffect || !currentArticleIdForEffect) {
                    const article = res.data;
                    setTitle(article.title);
                    setContent(article.content);
                    setYoutubeUrl(article.youtubeVideoId ? `https://www.youtube.com/watch?v=${article.youtubeVideoId}` : '');
                    if (article.hasImage) {
                        setInitialImageExists(true);
                        const timestamp = article.updatedAt ? new Date(article.updatedAt).getTime() : new Date().getTime();
                        const imagePath = `${API_BASE_URL}/api/articles/${id}/image?t=${timestamp}`;
                        setImagePreview(imagePath);
                    } else {
                        setInitialImageExists(false);
                        setImagePreview('');
                    }
                    setRemoveCurrentImage(false);
                    setImageFile(null);
                }
            })
            .catch(err => {
                console.error("ArticleForm.jsx: Error fetching article data:", err);
                alert(`Gagal memuat data artikel: ${err.response?.data?.message || err.message}`);
            })
            .finally(() => {
                if (id === currentArticleIdForEffect || !currentArticleIdForEffect) {
                    setIsLoading(false);
                }
            });
    } else if (!id) {
        setTitle('');
        setContent('');
        setImageFile(null);
        setImagePreview('');
        setYoutubeUrl('');
        setInitialImageExists(false);
        setRemoveCurrentImage(false);
        setIsLoading(false);
        setCurrentArticleIdForEffect(null);
    }
  }, [id, isEditing, API_BASE_URL, currentArticleIdForEffect, getYouTubeVideoId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setRemoveCurrentImage(false);
      setInitialImageExists(false);
    } else {
      // Jika pembatalan file picker, jangan langsung hapus preview jika ada initial image
      if (!initialImageExists || removeCurrentImage) {
          setImageFile(null);
          setImagePreview('');
      } else if (isEditing && initialImageExists && !removeCurrentImage) {
        // Kembalikan ke gambar awal dari DB jika ada dan tidak berniat menghapus
        const timestamp = new Date().getTime();
        const originalDbImageUrl = `${API_BASE_URL}/api/articles/${id}/image?t=${timestamp}`;
        setImagePreview(originalDbImageUrl);
        setImageFile(null); // Pastikan imageFile null karena tidak ada file baru yg dipilih
      }
    }
  };

  const handleRemoveCurrentImage = () => {
    setRemoveCurrentImage(true);
    setImageFile(null);
    setImagePreview(''); // Kosongkan preview segera
    // initialImageExists biarkan, karena ini menandakan gambar *pernah* ada di server
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (isEditing && removeCurrentImage && initialImageExists) { // Pastikan initialImageExists true
      formData.append('removeImage', 'true');
    }

    const videoId = getYouTubeVideoId(youtubeUrl);
    formData.append('youtubeVideoId', videoId);
    
    try {
      let response;
      if (isEditing) {
        response = await api.put(`/api/admin/articles/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/api/admin/articles', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      console.log('ArticleForm.jsx: Article saved successfully:', response.data);
      navigate('/admin/articles');
    } catch (err) {
      console.error("ArticleForm.jsx: Error saving article:", err.response || err);
      alert(`Gagal menyimpan artikel: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showImagePreview = imagePreview && !removeCurrentImage;
  const uploadButtonText = showImagePreview ? 'Ganti Gambar' : 'Unggah File Gambar';

  if (isLoading && isEditing && currentArticleIdForEffect === id) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3 text-green-700">Memuat data artikel...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
            {isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru'}
          </h1>
          <Link
            to="/admin/articles"
            className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-green-700 mb-1">Judul Artikel</label>
            <input
              type="text"
              id="title"
              className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="Masukkan judul artikel"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-green-700 mb-1">Isi Artikel</label>
            <textarea
              id="content"
              className="w-full p-3 border border-green-300 rounded-lg h-64 min-h-[150px] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              placeholder="Tulis isi artikel di sini..."
              disabled={isLoading}
            />
          </div>

          {/* --- MODIFIED IMAGE UPLOAD SECTION --- */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Gambar Artikel (Opsional)
            </label>
            <div className="mt-1 p-6 border-2 border-green-300 border-dashed rounded-md space-y-4">
              {showImagePreview && (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Pratinjau Gambar"
                    className="mx-auto max-h-60 w-auto object-contain rounded-md shadow mb-3"
                    onError={(e) => {
                        console.error('ArticleForm.jsx: Error loading image preview:', imagePreview, e);
                        e.target.alt = 'Gagal memuat pratinjau';
                        e.target.src = 'https://via.placeholder.com/300x200?text=Error+Memuat+Gambar'; // Fallback image
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveCurrentImage}
                    className="text-sm text-red-600 hover:text-red-800 flex items-center justify-center mx-auto bg-red-100 hover:bg-red-200 px-3 py-1.5 rounded-md transition-colors duration-150"
                    disabled={isLoading}
                  >
                    <Trash2 size={14} className="mr-1.5" /> Hapus Gambar Ini
                  </button>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {(!showImagePreview || removeCurrentImage) && ( // Show icon if no preview or if we're in 'remove mode'
                    <UploadCloud className="h-12 w-12 text-green-400 mb-2" />
                )}
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer font-medium text-white rounded-lg px-4 py-2.5 transition-colors duration-150 flex items-center group
                              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500'}`}
                >
                  <ImagePlus size={18} className="mr-2 group-hover:animate-pulse" />
                  <span>{uploadButtonText}</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isLoading} />
                </label>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF. Ukuran maks: 5MB.</p>
              </div>
              
              {removeCurrentImage && initialImageExists && (
                <p className="text-sm text-center text-orange-600 bg-orange-100 p-2 rounded-md">
                  Gambar sebelumnya akan dihapus saat disimpan. <br/> Unggah file baru untuk mengganti atau biarkan kosong.
                </p>
              )}
            </div>
          </div>
          {/* --- END OF MODIFIED IMAGE UPLOAD SECTION --- */}


          <div>
            <label htmlFor="youtubeUrl" className="block text-sm font-medium text-green-700 mb-1">
              Link Video YouTube (Opsional)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Youtube className="h-5 w-5 text-gray-400" />
                </div>
                <input
                type="url"
                id="youtubeUrl"
                className="w-full p-3 pl-10 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="Contoh: https://www.youtube.com/watch?v=VIDEO_ID"
                disabled={isLoading}
                />
            </div>
            {youtubeUrl && getYouTubeVideoId(youtubeUrl) && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Pratinjau Video:</p>
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(youtubeUrl)}`}
                        title="Pratinjau Video YouTube"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                    </div>
                </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto flex-grow bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (isEditing ? 'Menyimpan...' : 'Memublikasikan...') : (isEditing ? 'Simpan Perubahan' : 'Publikasikan Artikel')}
            </button>
            <Link
              to="/admin/articles"
              className={`w-full sm:w-auto text-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200 text-lg ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
            >
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
