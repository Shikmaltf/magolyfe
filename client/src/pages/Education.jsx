// frontend/src/pages/Education.jsx
import React from 'react';
import { PlayCircle, BookOpen, Users, Zap } from 'lucide-react'; // Menggunakan ikon dari Lucide

// Daftar video edukasi
const educationVideos = [
  {
    id: '1', // ID unik untuk key
    title: '(Bagian 1) Mengenal Maggot BSF dan Budidayanya',
    videoId: 'IOuZviTatyI', // ID video YouTube 
    description: 'Ayo mengenal Maggot BSF dan budidayanya!',
  },
  {
    id: '2',
    title: '(Bagian 2) Pengolahan Limbah Organik Menggunakan Maggot BSF',
    videoId: 'zN9Wg6G_NSg', // ID video YouTube
    description: 'Mari simak proses pengolahan limbah organik menggunakan Maggot BSF, Sang robot organik!',
  },
];

// Komponen untuk menampilkan satu item video
const VideoItem = ({ title, videoId, description }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl">
    <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
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
const InfoCard = ({ icon, title, text, image }) => (
  <div className="bg-green-50 rounded-lg shadow-md overflow-hidden flex">
    {image && (
      <img
        src={image}
        alt={title}
        className="w-40 h-40 object-cover"
      />
    )}
    <div className="p-6 flex flex-col justify-start space-y-2">
      <div className="flex items-center space-x-2">
        <div className="text-green-600">{icon}</div>
        <h3 className="font-semibold text-green-800">{title}</h3>
      </div>
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
          <h1 className="text-5xl font-extrabold text-green-800 mb-3">
            Pusat Edukasi Pengolahan Limbah Organik dengan Maggot BSF
          </h1>
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
              image={"ayam.jpeg"}
              title="Solusi Pakan Bergizi"
              text="Maggot kaya akan protein dan lemak, ideal sebagai pakan alami untuk unggas, ikan, dan reptil, meningkatkan pertumbuhan dan kesehatan ternak."
            />
            <InfoCard
              image={"magotmakan.jpeg"}
              title="Pengelolaan Sampah Efektif"
              text="Satu kilogram larva BSF dapat mengurai hingga 1-2 kg sampah organik per hari, mengurangi limbah rumah tangga dan pasar secara signifikan."
            />
             <InfoCard 
              image={"kasgot.jpg"}
              title="Pupuk Kasgot Berkualitas"
              text="kotoran maggot (kasgot) merupakan pupuk organik padat yang sangat baik untuk kesuburan tanah."
            />
            <InfoCard
              image={"ayam.jpeg"}
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
                    <h3 className="text-xl font-semibold text-green-800 mb-2 text-center">Jaga Kelembaban</h3>
                    <img 
                        src="lembap.png"></img> 
                    <p className="text-gray-600 text-sm mt-3">Pastikan media budidaya tidak terlalu kering atau terlalu basah. Kelembaban ideal sekitar 60-70%.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-green-800 mb-2 text-center">Ventilasi Baik</h3>
                    <img 
                        src="sirkulasi.png"></img> 
                    <p className="text-gray-600 text-sm mt-3">Sirkulasi udara yang baik penting untuk mencegah bau dan pertumbuhan jamur yang tidak diinginkan.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="text-xl font-semibold text-green-800 mb-2 text-center">Pakan Bervariasi</h3>
                    <img 
                        src="sayurbuah.png"></img> 
                    <p className="text-gray-600 text-sm mt-3">Berikan pakan organik yang bervariasi seperti sisa buah, sayur, atau ampas tahu untuk nutrisi optimal.</p>
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
            Hubungi Kami
          </a>
        </footer>

      </div>
    </div>
  );
};

export default Education;
