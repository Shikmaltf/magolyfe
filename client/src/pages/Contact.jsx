import React, { useState, useEffect } from 'react';
import { Send, Mail, Phone, MapPin, MessageSquare, Instagram as InstagramIcon, Star, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import api from '../config/axios';

// --- Komponen Item Info Kontak ---
const ContactInfoItem = ({ icon, title, children }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 text-green-600 mt-1">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  </div>
);

// --- Komponen Form Ulasan ---
const ReviewForm = ({ onReviewAdded }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || !description.trim() || !name.trim()) {
            setError('Nama, rating bintang, dan ulasan tidak boleh kosong.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const response = await api.post('/api/reviews', { name, rating, description });
            setSuccess('Ulasan Anda berhasil dikirim! Terima kasih.');
            setName('');
            setRating(0);
            setDescription('');
            if (onReviewAdded) {
                onReviewAdded(response.data); // Kirim data ulasan baru ke parent
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim ulasan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                <MessageSquareQuote size={28} className="mr-3 text-lime-500" />
                Berikan Ulasan Anda
            </h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-4">
                    <label htmlFor="review-name" className="block text-sm font-medium 
                    text-gray-700 mb-1">Nama Anda</label>
                    <input
                        type="text"
                        id="review-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                        shadow-sm focus:ring-green-500 focus:border-green-500"
                        required
                        placeholder="Contoh: Budi"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`cursor-pointer w-8 h-8 transition-colors 
                                    ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                                fill={rating >= star ? 'currentColor' : 'none'}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-medium 
                    text-gray-700 mb-1">Ulasan Anda</label>
                    <textarea
                        id="description"
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 
                        rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                        required
                        placeholder="Bagaimana pengalaman Anda dengan Magolyfe?"
                    ></textarea>
                </div>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center bg-green-600 
                    hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg 
                    shadow-md hover:shadow-lg transition-all duration-300 disabled:bg-green-400 
                    disabled:cursor-not-allowed"
                >
                    <Send size={20} className="mr-2" />
                    {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
            </form>
        </div>
    );
};

// --- Komponen Carousel Ulasan ---
const ReviewsCarousel = ({ reviews, loading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const nextReview = () => {
        if (reviews.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }
    };

    const prevReview = () => {
        if (reviews.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
        }
    };
    
    useEffect(() => {
        if (!isHovered && reviews.length > 1) {
            const intervalId = setInterval(nextReview, 2000);
            return () => clearInterval(intervalId);
        }
    }, [currentIndex, isHovered, reviews.length]);

    if (loading) {
        return <div className="text-center p-8 bg-gray-100 rounded-lg">Memuat ulasan...</div>;
    }

    if (!reviews || reviews.length === 0) {
        return (
             <div className="text-center text-gray-500 p-8 bg-gray-100 rounded-lg">
                Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
            </div>
        );
    }
    
    return (
        <section 
            className="mt-12 bg-green-50 p-8 rounded-xl shadow-lg relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
             <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                Apa Kata Mereka?
            </h2>
            <div className="relative flex items-center justify-center">
                {reviews.length > 1 && (
                    <button onClick={prevReview} className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors -translate-x-4">
                        <ChevronLeft className="text-green-600" />
                    </button>
                )}
                
                <div className="w-full overflow-hidden">
                    <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {reviews.map((review) => (
                           <div key={review._id} className="w-full flex-shrink-0 px-4">
                               <div className="bg-white p-6 rounded-lg shadow text-center">
                                   <div className="flex justify-center mb-3">
                                       {[...Array(5)].map((_, i) => (
                                           <Star key={i} className={`w-6 h-6 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor"/>
                                       ))}
                                   </div>
                                   <p className="text-gray-600 italic mb-4">"{review.description}"</p>
                                   <p className="font-semibold text-green-700">- {review.name}</p>
                               </div>
                           </div>
                        ))}
                    </div>
                </div>

                {reviews.length > 1 && (
                    <button onClick={nextReview} className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors translate-x-4">
                        <ChevronRight className="text-green-600" />
                    </button>
                )}
            </div>
        </section>
    );
};


// --- Komponen Halaman Kontak ---
const Contact = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER;

    useEffect(() => {
        const fetchReviews = async () => {
          try {
            setLoadingReviews(true);
            const response = await api.get('/api/reviews');
            setReviews(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
          } catch (error) {
            console.error("Gagal mengambil ulasan:", error);
          } finally {
            setLoadingReviews(false);
          }
        };
        fetchReviews();
      }, []);
    
    const handleNewReview = (newReview) => {
        setReviews(prevReviews => [newReview, ...prevReviews]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) {
            alert("Nama dan Pesan tidak boleh kosong.");
            return;
        }

        if (!whatsappNumber) {
            alert("Nomor WhatsApp tujuan belum diatur dengan benar. Silakan periksa konfigurasi.");
            console.warn("WhatsApp number is not configured.");
            return;
        }

        const whatsappMessage = `Halo, saya ${name},\n\n${message}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-12">
                    <MessageSquare size={64} className="mx-auto text-green-600 mb-4" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
                        Hubungi Kami
                    </h1>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Kami senang mendengar dari Anda! Baik itu pertanyaan, masukan, atau sekadar ingin menyapa, jangan ragu untuk menghubungi tim Magolyfe.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl order-2 md:order-1 h-full flex flex-col">
                        <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                            <Send size={28} className="mr-3 text-green-500" />
                            Kirim Pesan Langsung
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5 flex flex-col flex-grow">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nama Anda"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                    required
                                />
                            </div>
                            <div className="flex flex-col flex-grow">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                                <textarea
                                    id="message"
                                    placeholder="Tuliskan pesan Anda di sini..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none flex-grow min-h-[9rem]"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg mt-auto"
                            >
                                <Send size={20} className="mr-2" />
                                Kirim via WhatsApp
                            </button>
                        </form>
                    </div>

                    <div className="bg-green-50 p-6 sm:p-8 rounded-xl shadow-xl order-1 md:order-2 space-y-6 h-full">
                        <h2 className="text-2xl font-bold text-green-700 mb-6">
                            Informasi Kontak Lainnya
                        </h2>
                        <ContactInfoItem icon={<MapPin size={24} />} title="Energy of Jamaras">
                            <a href="https://maps.app.goo.gl/Pn6TM1iXuknHZCgx5" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors">
                                Jl. Jamaras III, Kel. Jatihandap,<br />
                                Kec Mandalajati, Kota Bandung, Jawa Barat <br />
                                (Kunjungan hanya dengan perjanjian)
                            </a>
                        </ContactInfoItem>
                        <hr className="border-green-200"/>
                        <ContactInfoItem icon={<Phone size={20} />} title="Telepon">
                            <a href="tel:6289524685375" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors">+62 895-2468-5375</a>
                        </ContactInfoItem>
                        <hr className="border-green-200"/>
                        <ContactInfoItem icon={<InstagramIcon size={20} />} title="Instagram">
                            <a href="https://www.instagram.com/ksm_watesa_jamaras_02" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors">@ksm_watesa_jamaras_02</a>
                        </ContactInfoItem>
                        <hr className="border-green-200"/>
                        <ContactInfoItem icon={<Mail size={20} />} title="Email">
                            <a href="mailto:ksmwatesa.jamaras02@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-green-700 transition-colors">ksmwatesa.jamaras02@gmail.com</a>
                        </ContactInfoItem>
                    </div>
                </div>
                
                {/* --- Bagian Ulasan --- */}
                <div className="mt-16">
                    <ReviewsCarousel reviews={reviews} loading={loadingReviews} />
                </div>
                <div className="mt-12">
                    <ReviewForm onReviewAdded={handleNewReview} />
                </div>

            </div>
        </div>
    );
};

export default Contact;
