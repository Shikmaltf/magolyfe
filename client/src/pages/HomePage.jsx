// frontend/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Asumsi Anda menggunakan React Router
import { Zap, Leaf, Users, ShieldCheck, PlayCircle, ShoppingBag, Recycle, ShoppingBagIcon, LucideRecycle, GalleryHorizontalEndIcon, CameraIcon, LucideLeafyGreen, LeafyGreen } from 'lucide-react';

const FeatureCard = ({ icon, title, description, link, linkText }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-green-200/50 transition-shadow duration-300 flex flex-col items-center text-center h-full"> {/* Added h-full for equal height cards */}
    <div className="mb-4 text-green-600">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
    {link && linkText && (
      <Link to={link} className="mt-auto bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        {linkText}
      </Link>
    )}
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center bg-cover bg-center" style={{ backgroundImage: "url('https://th.bing.com/th/id/OIP.ZCz1R88I1MQPPO9whPSfNgHaEK?rs=1&pid=ImgDetMain')" }}> {/* Placeholder image */}
        <div className="container mx-auto px-6 bg-black bg-opacity-60 py-10 rounded-xl md:max-w-3xl"> {/* Increased opacity for better text readability */}
          <Leaf size={64} className="mx-auto mb-6 text-lime-400 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            Selamat Datang di <span className="text-lime-300">Magolyfe</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Platform edukasi pengolahan limbah yang berfokus pada limbah organik menggunakan maggot BSF dan membantu anda terhubung dengan komunitas penggeraknya, KSM Watesa Jamaras 02
          </p>
          {/* Responsive Buttons Container */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to="/education"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 inline-block text-lg w-full sm:w-auto" // Added w-full sm:w-auto
            >
              Mulai Belajar
            </Link>
            <Link
              to="/product"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 inline-block text-lg w-full sm:w-auto" // Added w-full sm:w-auto
            >
              Lihat Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Fitur Unggulan Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-4">
            Ada apa di Magolyfe?
          </h2>
          <p className="text-center text-gray-600 mb-12 md:mb-16 max-w-xl mx-auto">
           Magolyfe memberi jawaban atas isu penumpukan sampah di lingkungan masyarakat, untuk itu, Magolyfe menyediakan:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Recycle size={48} />}
              title="Budidaya Maggot Inovatif"
              description="Pelajari teknik budidaya maggot BSF yang efisien untuk solusi pengelolaan limbah organik yang ramah lingkungan."
              link="/education"
              linkText="Mulai Belajar"
            />
            <FeatureCard
              icon={<ShoppingBag size={48} />}
              title="Produk Olahan Limbah"
              description="Ikut berpartisipasi dalam menjaga lingkungan melalui penggunaan produk olahan limbah organik yang berkualitas."
              link="/product"
              linkText="Lihat Produk"
            />
            <FeatureCard
              icon={<Users size={48} />}
              title="Komunitas & Dukungan"
              description="Berbagi pengetahuan dengan KSM Watesa Jamaras 02 dan dapatkan dukungan dalam perjalanan Anda menuju gaya hidup yang lebih sehat."
              link="/contact"
              linkText="Hubungi Kami"
            />
          </div>
        </div>
      </section>

      {/* Testimonial atau CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 text-green-800">
        <div className="container mx-auto px-6 text-center">
          <CameraIcon size={56} className="mx-auto mb-6 text-lime-500" /> {/* Adjusted color for better contrast */}
          <h2 className="text-3xl font-bold mb-4">Siap Mengubah Gaya Hidup Anda?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            Jelajahi sumber daya kami, temukan produk berkualitas, dan mulailah langkah Anda menuju kehidupan yang lebih sehat dan selaras dengan alam bersama Magolyfe.
          </p>
          <Link
            to="/gallery"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 inline-block text-lg"
          >
            Lihat Galeri Kami
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
