// frontend/src/components/ProductForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../config/axios';
import { ArrowLeft, UploadCloud, Youtube, Trash2, ImagePlus } from 'lucide-react';
import Cropper from 'react-easy-crop';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // raw numeric string
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [initialImageExists, setInitialImageExists] = useState(false);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProductIdForEffect, setCurrentProductIdForEffect] = useState(null);

  // Cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(16 / 9);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const isEditing = !!id;

  // Price formatting helpers
  const formatPriceForDisplay = useCallback((numStr) => {
    if (!numStr) return '';
    const cleanedNumStr = String(numStr).replace(/\D/g, '');
    if (cleanedNumStr === '') return '';
    return cleanedNumStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);

  const parsePriceFromDisplay = useCallback((displayValue) => {
    if (!displayValue) return '';
    return String(displayValue).replace(/\D/g, '');
  }, []);

  // YouTube ID extraction
  const getYouTubeVideoId = useCallback((url) => {
    if (!url) return '';
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)([^#&?]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^#&?]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    try {
      const parsedUrl = new URL(url);
      const videoId = parsedUrl.searchParams.get('v') || parsedUrl.searchParams.get('video_id');
      if (videoId && videoId.length === 11) return videoId;
    } catch {}
    return '';
  }, []);

  // Load product data if editing
  useEffect(() => {
    if (id && id !== currentProductIdForEffect) {
      setCurrentProductIdForEffect(id);
      setIsLoading(true);
      api.get(`/api/admin/products/${id}`)
        .then(res => {
          const product = res.data;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price ? product.price.toString() : '');
          setYoutubeUrl(product.youtubeVideoId ? `https://www.youtube.com/watch?v=${product.youtubeVideoId}` : '');
          if (product.hasImage) {
            setInitialImageExists(true);
            const timestamp = product.updatedAt ? new Date(product.updatedAt).getTime() : Date.now();
            setImagePreview(`${API_BASE_URL}/api/products/${id}/image?t=${timestamp}`);
          } else {
            setInitialImageExists(false);
            setImagePreview('');
          }
          setRemoveCurrentImage(false);
          setImageFile(null);
        })
        .catch(err => {
          window.alert(`Gagal memuat data produk: ${err.response?.data?.message || err.message}`);
        })
        .finally(() => setIsLoading(false));
    } else if (!id) {
      // Reset form for new product
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      setImagePreview('');
      setYoutubeUrl('');
      setInitialImageExists(false);
      setRemoveCurrentImage(false);
      setIsLoading(false);
      setCurrentProductIdForEffect(null);
    }
  }, [id, currentProductIdForEffect, API_BASE_URL]);

  // Handle image file input change -> show cropper
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setRemoveCurrentImage(false);
      setInitialImageExists(false);
      setShowCropper(true);
    } else {
      if (isEditing && initialImageExists && !removeCurrentImage) {
        const timestamp = Date.now();
        setImagePreview(`${API_BASE_URL}/api/products/${id}/image?t=${timestamp}`);
        setImageFile(null);
      } else {
        setImageFile(null);
        setImagePreview('');
      }
    }
  };

  // Remove current image
  const handleRemoveCurrentImage = () => {
    setRemoveCurrentImage(true);
    setImageFile(null);
    setImagePreview('');
  };

  // Cropper handlers
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = useCallback((imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.floor(pixelCrop.width));
        canvas.height = Math.max(1, Math.floor(pixelCrop.height));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('Failed to create cropped blob'));
          blob.name = 'cropped.jpeg';
          resolve(new File([blob], blob.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', 0.92);
      };
      image.onerror = reject;
    });
  }, []);

  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels) {
        setShowCropper(false);
        return;
      }
      const croppedFile = await getCroppedImg(imagePreview, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedFile);
      setImageFile(croppedFile);
      setImagePreview(croppedUrl);
      setShowCropper(false);
    } catch {
      alert('Gagal memotong gambar');
      setShowCropper(false);
    }
  };

  // Price input handler
  const handlePriceInputChange = (e) => {
    const displayValue = e.target.value;
    const numericString = parsePriceFromDisplay(displayValue);
    if (/^\d*$/.test(numericString)) {
      setPrice(numericString);
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (isEditing && removeCurrentImage && initialImageExists) {
      formData.append('removeImage', 'true');
    }

    formData.append('youtubeVideoId', getYouTubeVideoId(youtubeUrl));

    try {
      if (isEditing) {
        await api.put(`/api/admin/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      navigate('/admin/products');
    } catch (err) {
      alert(`Gagal menyimpan produk: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showImagePreview = imagePreview && !removeCurrentImage;
  const uploadButtonText = showImagePreview ? 'Ganti Gambar' : 'Unggah File Gambar';

  if (isLoading && isEditing && currentProductIdForEffect === id) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3 text-green-700">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <>
      {showCropper && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4">
            <div className="relative w-full h-72 bg-gray-800 rounded">
              <Cropper
                image={imagePreview}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
                  <select
                    value={aspect}
                    onChange={e => setAspect(Number(e.target.value))}
                    className="mt-1 block rounded border px-2 py-1"
                  >
                    <option value={4 / 3}>4:3</option>
                    <option value={16 / 9}>16:9</option>
                    <option value={3 / 2}>3:2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zoom</label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCropper(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-800">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
            <Link
              to="/admin/products"
              className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-green-700 mb-1">Nama Produk</label>
              <input
                type="text"
                id="name"
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Masukkan nama produk"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-green-700 mb-1">Deskripsi Produk</label>
              <textarea
                id="description"
                className="w-full p-3 border border-green-300 rounded-lg h-40 min-h-[100px] focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                placeholder="Jelaskan tentang produk Anda..."
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-green-700 mb-1">Harga (Rp)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm font-medium">Rp</span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  id="price"
                  className="w-full p-3 pl-10 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  value={formatPriceForDisplay(price)}
                  onChange={handlePriceInputChange}
                  required
                  placeholder="0"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* IMAGE UPLOAD WITH PREVIEW AND REMOVE */}
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Gambar Produk (Opsional)</label>
              <div className="mt-1 p-6 border-2 border-green-300 border-dashed rounded-md space-y-4">
                {showImagePreview && (
                  <div className="text-center">
                    <img
                      src={imagePreview}
                      alt="Pratinjau Gambar Produk"
                      className="mx-auto max-h-60 w-auto object-contain rounded-md shadow mb-3"
                      onError={(e) => {
                        e.target.alt = 'Gagal memuat pratinjau';
                        e.target.src = `https://placehold.co/300x200/e2e8f0/94a3b8?text=Error+Memuat+Gambar`;
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
                  {(!showImagePreview || removeCurrentImage) && <UploadCloud className="h-12 w-12 text-green-400 mb-2" />}
                  <label
                    htmlFor="product-image-upload"
                    className={`cursor-pointer font-medium text-white rounded-lg px-4 py-2.5 transition-colors duration-150 flex items-center group
                      ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500'}`}
                  >
                    <ImagePlus size={18} className="mr-2 group-hover:animate-pulse" />
                    <span>{uploadButtonText}</span>
                    <input
                      id="product-image-upload"
                      name="image"
                      type="file"
                      className="sr-only"
                      onChange={handleImageChange}
                      accept="image/*"
                      disabled={isLoading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF. Ukuran maks: 5MB.</p>
                </div>

                {removeCurrentImage && initialImageExists && (
                  <p className="text-sm text-center text-orange-600 bg-orange-100 p-2 rounded-md">
                    Gambar sebelumnya akan dihapus saat disimpan. <br /> Unggah file baru untuk mengganti atau biarkan kosong.
                  </p>
                )}
              </div>
            </div>

            {/* YOUTUBE VIDEO URL */}
            <div>
              <label htmlFor="youtubeUrlProduct" className="block text-sm font-medium text-green-700 mb-1">
                Link Video YouTube Produk (Opsional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Youtube className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  id="youtubeUrlProduct"
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
                      title="Pratinjau Video YouTube Produk"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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
                {isLoading ? (isEditing ? 'Menyimpan...' : 'Menambahkan...') : (isEditing ? 'Simpan Perubahan' : 'Tambahkan Produk')}
              </button>
              <Link
                to="/admin/products"
                className={`w-full sm:w-auto text-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition duration-200 text-lg ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                Batal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProductForm;