// frontend/src/pages/Admin/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Star, MessageSquareQuote, ArrowLeft, ShieldAlert } from 'lucide-react';
import api from '../../config/axios';
import { getToken } from '../../utils/auth';

// Komponen untuk menampilkan bintang rating
const StarRating = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor"/>
        ))}
    </div>
);

// Komponen Modal Konfirmasi
const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <div className="flex items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ShieldAlert className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Konfirmasi Penghapusan</h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">{message}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={onConfirm}
                    >
                        Hapus
                    </button>
                    <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={onClose}
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
};

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalState, setModalState] = useState({ isOpen: false, reviewId: null });
    
    // Fungsi untuk memuat ulasan dari server
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/reviews');
            setReviews(response.data);
        } catch (err) {
            setError('Gagal memuat ulasan. Silakan coba lagi.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // Fungsi untuk membuka modal konfirmasi
    const handleDeleteClick = (reviewId) => {
        setModalState({ isOpen: true, reviewId: reviewId });
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setModalState({ isOpen: false, reviewId: null });
    };

    // Fungsi untuk menghapus ulasan setelah dikonfirmasi
    const handleConfirmDelete = async () => {
        const reviewId = modalState.reviewId;
        if (!reviewId) return;

        try {
            const token = getToken();
            await api.delete(`/api/reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Hapus ulasan dari state untuk memperbarui UI secara real-time
            setReviews(reviews.filter((review) => review._id !== reviewId));
        } catch (err) {
            setError('Gagal menghapus ulasan.');
            console.error(err);
        } finally {
            handleCloseModal(); // Tutup modal setelah selesai
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Memuat ulasan...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    return (
        <>
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
                message="Apakah Anda yakin ingin menghapus ulasan ini? Tindakan ini tidak dapat dibatalkan."
            />
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8 flex justify-between items-center">
                        <div className="flex items-center">
                           <MessageSquareQuote size={32} className="text-green-600 mr-3" />
                           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Kelola Ulasan</h1>
                        </div>
                         <Link
                            to="/admin"
                            className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition duration-200 text-sm sm:text-base"
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Kembali ke Dashboard
                        </Link>
                    </header>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12 px-6 bg-white rounded-lg shadow">
                            <p className="text-gray-500">Belum ada ulasan yang masuk.</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                           <ul className="divide-y divide-gray-200">
                                {reviews.map((review) => (
                                    <li key={review._id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                            <div className="flex-1 mb-4 sm:mb-0">
                                                <div className="flex items-center mb-2">
                                                    <StarRating rating={review.rating} />
                                                    <span className="ml-3 text-sm font-semibold text-gray-800">{review.name}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm italic">"{review.description}"</p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {new Date(review.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteClick(review._id)}
                                                className="flex-shrink-0 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm"
                                                title="Hapus Ulasan"
                                            >
                                                <Trash2 size={16} className="mr-2" />
                                                Hapus
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Reviews;
