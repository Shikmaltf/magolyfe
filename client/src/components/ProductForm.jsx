// frontend/src/components/ProductForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../config/axios'; // Assuming api is your Axios instance
import { ArrowLeft, UploadCloud, Youtube, Trash2, ImagePlus } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  console.log(`ProductForm.jsx: Component mounted. ID from useParams: ${id}`);

  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(''); // Stores raw numeric string, e.g., "1000000"
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [initialImageExists, setInitialImageExists] = useState(false);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentProductIdForEffect, setCurrentProductIdForEffect] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const isEditing = !!id;

  // Helper function to format price for display (e.g., 1000000 -> "1.000.000")
  const formatPriceForDisplay = useCallback((numStr) => {
    if (!numStr) return '';
    const cleanedNumStr = String(numStr).replace(/\D/g, ''); // Remove non-digits
    if (cleanedNumStr === '') return '';
    // Add dots as thousand separators
    return cleanedNumStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }, []);

  // Helper function to parse displayed price back to raw numeric string
  const parsePriceFromDisplay = useCallback((displayValue) => {
    if (!displayValue) return '';
    return String(displayValue).replace(/\D/g, ''); // Remove dots and any other non-digit
  }, []);


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
        // Ignore URL parsing errors for invalid URLs
    }
    console.warn("ProductForm.jsx: Could not extract YouTube Video ID from URL:", url);
    return '';
  }, []);

  useEffect(() => {
    console.log(`ProductForm.jsx: useEffect triggered. ID: ${id}, isEditing: ${isEditing}, currentProductIdForEffect: ${currentProductIdForEffect}`);
    if (id && id !== currentProductIdForEffect) {
        setCurrentProductIdForEffect(id);
        setIsLoading(true);
        api.get(`/api/admin/products/${id}`)
            .then(res => {
                // Check if the fetched data is still for the current ID in view
                // This prevents race conditions if the user navigates quickly
                if (id === currentProductIdForEffect || !currentProductIdForEffect) {
                    const product = res.data;
                    setName(product.name);
                    setDescription(product.description);
                    // Price is stored as a number in DB, convert to string for state
                    setPrice(product.price ? product.price.toString() : '');
                    setYoutubeUrl(product.youtubeVideoId ? `https://www.youtube.com/watch?v=${product.youtubeVideoId}` : '');
                    if (product.hasImage) {
                        setInitialImageExists(true);
                        const timestamp = product.updatedAt ? new Date(product.updatedAt).getTime() : new Date().getTime();
                        const imagePath = `${API_BASE_URL}/api/products/${id}/image?t=${timestamp}`;
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
                console.error("ProductForm.jsx: Error fetching product data:", err);
                // Use a more user-friendly way to show errors than alert in a real app
                // For now, keeping alert as per original code
                window.alert(`Gagal memuat data produk: ${err.response?.data?.message || err.message}`);
            })
            .finally(() => {
                if (id === currentProductIdForEffect || !currentProductIdForEffect) {
                    setIsLoading(false);
                }
            });
    } else if (!id) { // Reset form for "Add New Product"
        setName('');
        setDescription('');
        setPrice('');
        setImageFile(null);
        setImagePreview('');
        setYoutubeUrl('');
        setInitialImageExists(false);
        setRemoveCurrentImage(false);
        setIsLoading(false);
        setCurrentProductIdForEffect(null); // Reset current product ID
    }
  }, [id, isEditing, API_BASE_URL, currentProductIdForEffect, getYouTubeVideoId]); // Added currentProductIdForEffect

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setRemoveCurrentImage(false); // If a new image is selected, don't mark for removal
      setInitialImageExists(false); // New file means the initial DB image is no longer relevant for preview
    } else {
      // If file input is cleared but there was an initial image and we haven't chosen to remove it
      if (isEditing && initialImageExists && !removeCurrentImage) {
        const timestamp = new Date().getTime(); // Cache buster
        const originalDbImageUrl = `${API_BASE_URL}/api/products/${id}/image?t=${timestamp}`;
        setImagePreview(originalDbImageUrl); // Restore preview of DB image
        setImageFile(null); // No new file selected
      } else { // No initial image, or it was marked for removal
        setImageFile(null);
        setImagePreview('');
      }
    }
  };

  const handleRemoveCurrentImage = () => {
    setRemoveCurrentImage(true);
    setImageFile(null); // Clear any selected new file
    setImagePreview(''); // Clear preview
    // initialImageExists remains true if there was an image in DB,
    // this flag along with removeCurrentImage=true signals backend to delete.
  };

  const handlePriceInputChange = (e) => {
    const displayValue = e.target.value;
    const numericString = parsePriceFromDisplay(displayValue);
    // Optionally, you can add validation here, e.g., max length or value
    if (/^\d*$/.test(numericString)) { // Allow only digits (or empty string)
        setPrice(numericString);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price); // Send the raw numeric string

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (isEditing && removeCurrentImage && initialImageExists) {
      // Only send removeImage if it was an existing image that's being removed
      formData.append('removeImage', 'true');
    }

    const videoId = getYouTubeVideoId(youtubeUrl);
    formData.append('youtubeVideoId', videoId);

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/api/admin/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      console.log('ProductForm.jsx: Product saved successfully:', response.data);
      navigate('/admin/products');
    } catch (err) {
      console.error("ProductForm.jsx: Error saving product:", err.response || err);
      // Use a more user-friendly way to show errors than alert in a real app
      window.alert(`Gagal menyimpan produk: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const showImagePreview = imagePreview && !removeCurrentImage;
  const uploadButtonText = showImagePreview ? 'Ganti Gambar' : 'Unggah File Gambar';

  // Loading state specifically for initial data fetch when editing
  if (isLoading && isEditing && currentProductIdForEffect === id) {
    return (
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-3 text-green-700">Memuat data produk...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen font-sans"> {/* Added font-sans for consistency */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">
            {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h1>
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
                type="text" // Changed from "number" to "text" to allow formatted display
                inputMode="numeric" // For mobile numeric keyboard
                id="price"
                className="w-full p-3 pl-10 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={formatPriceForDisplay(price)} // Display formatted price
                onChange={handlePriceInputChange} // Use custom handler
                required
                placeholder="0"
                disabled={isLoading}
                // min="0" is not directly applicable to type="text", validation can be added in handlePriceInputChange if needed
              />
            </div>
          </div>

          {/* --- IMAGE UPLOAD SECTION (Unchanged from original logic, just for context) --- */}
          <div>
            <label className="block text-sm font-medium text-green-700 mb-1">
              Gambar Produk (Opsional)
            </label>
            <div className="mt-1 p-6 border-2 border-green-300 border-dashed rounded-md space-y-4">
              {showImagePreview && (
                <div className="text-center">
                  <img
                    src={imagePreview}
                    alt="Pratinjau Gambar Produk"
                    className="mx-auto max-h-60 w-auto object-contain rounded-md shadow mb-3"
                    onError={(e) => {
                      console.error('ProductForm.jsx: Error loading image preview:', imagePreview, e);
                      e.target.alt = 'Gagal memuat pratinjau';
                      e.target.src = `https://placehold.co/300x200/e2e8f0/94a3b8?text=Error+Memuat+Gambar`; // Placeholder image
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
                 {(!showImagePreview || removeCurrentImage) && ( // Show icon if no preview or if current is marked for removal
                   <UploadCloud className="h-12 w-12 text-green-400 mb-2" />
                 )}
                <label
                  htmlFor="product-image-upload"
                  className={`cursor-pointer font-medium text-white rounded-lg px-4 py-2.5 transition-colors duration-150 flex items-center group
                                  ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500'}`}
                >
                  <ImagePlus size={18} className="mr-2 group-hover:animate-pulse" />
                  <span>{uploadButtonText}</span>
                  <input id="product-image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isLoading} />
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
          {/* --- END OF IMAGE UPLOAD SECTION --- */}


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
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow"> {/* Ensure aspect ratio Tailwind plugin is setup */}
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(youtubeUrl)}`}
                        title="Pratinjau Video YouTube Produk"
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
  );
};

export default ProductForm;
