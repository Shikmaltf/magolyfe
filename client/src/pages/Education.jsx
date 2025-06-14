// frontend/src/pages/Education.jsx
import React from 'react';
import { PlayCircle, BookOpen, Users, Zap } from 'lucide-react'; // Menggunakan ikon dari Lucide

// Daftar video edukasi (ganti dengan ID video YouTube yang relevan)
const educationVideos = [
  {
    id: '1', // ID unik untuk key
    title: 'Panduan Lengkap Budidaya Maggot BSF untuk Pemula',
    videoId: 'wus8-Fkk_s8', // Contoh ID video YouTube (Rick Astley - Never Gonna Give You Up)
    description: 'Pelajari dasar-dasar budidaya maggot Black Soldier Fly (BSF) dari persiapan hingga panen. Cocok untuk Anda yang baru memulai.',
  },
  {
    id: '2',
    title: 'Manajemen Pakan dan Media Tumbuh Maggot Berkualitas',
    videoId: 'wus8-Fkk_s8', // Contoh ID video YouTube (Another placeholder)
    description: 'Tips memilih pakan organik dan mengelola media tumbuh agar maggot berkembang optimal dan berkualitas tinggi.',
  },
];

// Komponen untuk menampilkan satu item video
const VideoItem = ({ title, videoId, description }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

// Komponen untuk menampilkan kartu informasi tambahan
const InfoCard = ({ icon, title, text }) => (
  <div className="bg-green-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
    <div className="text-green-600">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-green-800 mb-1">{title}</h3>
      <p className="text-gray-700 text-sm">{text}</p>
    </div>
  </div>
);

const Education = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Halaman */}
        <header className="mb-12 text-center">
          <BookOpen className="mx-auto text-green-600 h-16 w-16 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
            Pusat Edukasi Budidaya Maggot BSF
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Temukan panduan lengkap, tips, dan trik sukses beternak maggot Black Soldier Fly (BSF) untuk solusi pakan alternatif dan pengelolaan sampah organik yang berkelanjutan.
          </p>
        </header>

        {/* Pengantar Singkat */}
        <section className="mb-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <Zap size={28} className="mr-3 text-yellow-500" />
            Mengapa Budidaya Maggot?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Maggot BSF (Black Soldier Fly) adalah larva lalat tentara hitam yang memiliki potensi luar biasa. Mereka adalah pengurai sampah organik yang sangat efisien, mengubah limbah makanan menjadi biomassa kaya protein. Budidaya maggot tidak hanya membantu mengurangi volume sampah, tetapi juga menghasilkan produk bernilai tinggi seperti pakan ternak (unggas, ikan) dan pupuk organik berkualitas.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard 
              icon={<PlayCircle size={32} />}
              title="Solusi Pakan Bergizi"
              text="Maggot kaya akan protein dan lemak, ideal sebagai pakan alami untuk unggas, ikan, dan reptil, meningkatkan pertumbuhan dan kesehatan ternak."
            />
            <InfoCard
              icon={<Users size={32} />}
              title="Pengelolaan Sampah Efektif"
              text="Satu kilogram larva BSF dapat mengurai hingga 1-2 kg sampah organik per hari, mengurangi limbah rumah tangga dan pasar secara signifikan."
            />
             <InfoCard 
              icon={<BookOpen size={32} />}
              title="Pupuk Organik Berkualitas"
              text="Sisa media budidaya (kasgot) dan kotoran maggot merupakan pupuk organik padat dan cair yang sangat baik untuk kesuburan tanah."
            />
            <InfoCard
              icon={<Zap size={32} />}
              title="Ramah Lingkungan & Berkelanjutan"
              text="Budidaya maggot mengurangi emisi gas metana dari sampah, tidak berbau, dan mendukung ekonomi sirkular."
            />
          </div>
        </section>
        
        {/* Daftar Video Edukasi */}
        <section>
          <h2 className="text-3xl font-bold text-green-700 mb-8 text-center flex items-center justify-center">
            <PlayCircle size={36} className="mr-3" />
            Video Tutorial Budidaya Maggot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {educationVideos.map((video) => (
              <VideoItem
                key={video.id}
                title={video.title}
                videoId={video.videoId}
                description={video.description}
              />
            ))}
          </div>
        </section>

        {/* Tips Tambahan */}
        <section className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
                Tips Sukses Budidaya Maggot
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Jaga Kelembaban</h3>
                    <p className="text-gray-600 text-sm">Pastikan media budidaya tidak terlalu kering atau terlalu basah. Kelembaban ideal sekitar 60-70%.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Ventilasi Baik</h3>
                    <p className="text-gray-600 text-sm">Sirkulasi udara yang baik penting untuk mencegah bau dan pertumbuhan jamur yang tidak diinginkan.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">Pakan Bervariasi</h3>
                    <p className="text-gray-600 text-sm">Berikan pakan organik yang bervariasi seperti sisa buah, sayur, atau ampas tahu untuk nutrisi optimal.</p>
                </div>
            </div>
        </section>

        {/* Call to Action atau Link Terkait */}
        <footer className="mt-16 text-center">
          <p className="text-gray-700 mb-4">
            Tertarik untuk belajar lebih lanjut atau memulai budidaya maggot Anda sendiri? 
          </p>
          {/* Anda bisa menambahkan link ke halaman kontak, artikel, atau forum diskusi */}
          <a 
            href="/contact" // Ganti dengan link yang sesuai
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 inline-block"
          >
            Hubungi Kami untuk Info Lebih Lanjut
          </a>
        </footer>

      </div>
    </div>
  );
};

export default Education;
