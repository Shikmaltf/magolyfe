// frontend/src/pages/Education.jsx
import React from 'react';
import { PlayCircle, BookOpen, Users, Zap, Book, BookOpenCheck } from 'lucide-react'; // Menggunakan ikon dari Lucide

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
  {
    id: '3',
    title: 'Demo Penggunaan Web Magolyfe',
    videoId: 'XoKI8mg6Jdo', // ID video YouTube
    description: 'Yuk, jelajahi Magolyfe!',
  },
  {
    id: '4',
    title: 'Kegiatan Rutin KSM Watesa',
    videoId: 'IkdB_MhTJUM', // ID video YouTube
    description: 'Yuk intip kegiatan Ibu-ibu tangguh dari KSM Watesa setiap Hari Selasa dan Jumat di wilayah Jamaras 02!',
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

// Komponen untuk menampilkan kartu tips tambahan
const InfoCard = ({ title, text, image }) => (
  <div className="bg-green-50 rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
    {image && (
      <img
        src={image}
        alt={title}
        className="w-full h-48 md:h-full object-cover"
      />
    )}
    <div className="p-6 flex flex-col justify-center space-y-3">
      <h3 className="text-lg font-semibold text-green-800">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{text}</p>
    </div>
  </div>
);

const Education = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-lime-50 to-emerald-100 py-8 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto">
        {/* Header Halaman */}
        <header className="mb-12 text-center">
          <BookOpen className="mx-auto text-green-600 h-16 w-16 mb-4" />
          <h1 className="text-5xl font-extrabold text-green-800 mb-3">
            Pusat Edukasi Pengolahan Limbah Organik dengan Maggot BSF
          </h1>
          </header>

        {/* manfaat */}
        <section className="mb-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <Zap size={28} className="mr-3 text-yellow-500" />
            Mengapa Budidaya Maggot?
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Maggot BSF (Black Soldier Fly) adalah larva lalat tentara hitam yang memiliki potensi luar biasa. Mereka adalah pengurai sampah organik yang sangat efisien, 
            mengubah limbah makanan menjadi biomassa kaya protein. Budidaya maggot tidak hanya membantu mengurangi volume sampah, tetapi juga menghasilkan produk bernilai tinggi seperti pakan ternak (unggas, ikan) dan pupuk organik berkualitas.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <InfoCard 
              image={"ayam.jpg"}
              title="Solusi Pakan Bergizi"
              text="Maggot kaya akan protein dan lemak, ideal sebagai pakan alami untuk unggas, ikan, dan reptil, meningkatkan pertumbuhan dan kesehatan ternak."
            />
            <InfoCard
              image={"magotmakan.jpeg"}
              title="Pengelolaan Sampah Efektif"
              text="Satu kilogram larva BSF dapat mengurai hingga 1-3 kg sampah organik per hari, mengurangi limbah rumah tangga dan pasar secara signifikan."
            />
             <InfoCard 
              image={"kasgott.jpg"}
              title="Pemanfaatan Pupuk Kasgot"
              text="kotoran maggot (kasgot) merupakan pupuk organik padat yang baik untuk kesuburan tanah."
            />
            <InfoCard
              image={"lingkungan.jpeg"}
              title="Ramah Lingkungan & Berkelanjutan"
              text="Budidaya maggot mengurangi emisi gas metana dari sampah, tidak berbau, dan mendukung ekonomi sirkular."
            />
          </div>
        </section>
        
        {/* Video Edukasi */}
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
        {/* Sumber Referensi */}
        <section className="mb-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-green-700 mb-6 flex items-center">
            <BookOpenCheck size={28} className="mr-3 text-yellow-500" />
            Sumber Referensi
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-sm md:text-base text-gray-800">
            <li>
              <a
                href="https://www.academia.edu/download/105653248/12360.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 transition-colors"
              >
                Jurnal: Kandungan Nutrisi Kasgot Larva Lalat Tentara Hitam (Hermetia illucens) sebagai Pupuk Organik
              </a>
            </li>
            <li>
              <a
                href="https://ejournal.warmadewa.ac.id/index.php/wicaksana/article/view/11591"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 transition-colors"
              >
                Jurnal: Pemanfaatan Budidaya Maggot sebagai Pengelolaan Limbah Dapur Bernilai Ekonomis
              </a>
            </li>
            <li>
              <a
                href="https://e-journal.unmas.ac.id/index.php/jitumas/article/view/8965"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 transition-colors"
              >
                Jurnal: Teknologi Pengelolaan Sampah Organik Menggunakan Larva Black Soldier Fly di TPS3R
              </a>
            </li>
            <li>
              <a
                href="https://repository.umpar.ac.id/id/eprint/2207/1/eBook%20Reduksi%20Sampah%20Organik%20Budi%20Daya%20Magot.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 transition-colors"
              >
                E-Book: Reduksi Sampah Organik: Budi Daya Magot
              </a>
            </li>
            <li>
              <a
                href="https://ejournal.stebisigm.ac.id/index.php/AKM/article/view/650"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 transition-colors"
              >
                Jurnal: Pelatihan Pengembangan Maggot sebagai Pakan Ternak di Desa Karang Tunggal, Kec. Parenggean sebagai Model Kewirausahaan Sosial Masyarakat
              </a>
            </li>
            <li>
              <a
                href="https://jstl.unram.ac.id/index.php/jstl/article/view/422"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-700 transition-colors"
              >
                Jurnal: Kualitas Fisik dan Kimiawi Maggot BSF yang Dibudidaya oleh Peternak Menggunakan Media Pakan yang Berbeda
              </a>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <footer className="mt-16 text-center">
          <p className="text-gray-700 mb-4">
            Tertarik untuk belajar lebih lanjut atau memulai budidaya maggot Anda sendiri? 
          </p>
          <a 
            href="/contact" 
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
