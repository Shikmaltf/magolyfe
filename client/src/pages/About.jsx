// frontend/src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link dari react-router-dom
import { Leaf, Users, Target, Eye, CheckCircle } from 'lucide-react';

const TeamMemberCard = ({ name, role, imageUrl, bio }) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
    <img 
      src={imageUrl || `https://placehold.co/150x150/E0E0E0/757575?text=${name.charAt(0)}`} 
      alt={`[Foto ${name}]`}
      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-200"
      onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/150x150/E0E0E0/757575?text=${name.charAt(0)}&font=raleway`; }}
    />
    <h3 className="text-xl font-semibold text-green-700 mb-1">{name}</h3>
    <p className="text-sm text-lime-600 font-medium mb-2">{role}</p>
    <p className="text-xs text-gray-600">{bio}</p>
  </div>
);


const About = () => {
  // Data tim bisa diambil dari API atau didefinisikan di sini jika statis
  const teamMembers = [
    { name: 'Sayyidah Hikma Lutfiyana', role: 'Pengembang Platform', imageUrl: 'https://placehold.co/150x150/34D399/065F46?text=SHL&font=roboto', bio: 'Bertanggung jawab atas pengembangan teknologi dan pengalaman pengguna di Magolyfe.' },
  ];


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <Leaf size={60} className="mx-auto mb-4 text-green-600" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
            Tentang <span className="text-lime-600">Magolyfe</span>
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Mengenal lebih dekat siapa kami, apa yang kami lakukan, dan mengapa kami bersemangat tentang solusi alami untuk kehidupan yang lebih baik.
          </p>
        </header>

        {/* Sejarah Singkat atau Filosofi */}
        <section className="mb-12 bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
            <Eye size={28} className="mr-3 text-lime-500" />
            Filosofi Kami
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Magolyfe lahir dari kepedulian terhadap kesehatan manusia dan kelestarian lingkungan. Kami percaya bahwa alam menyediakan solusi luar biasa untuk tantangan modern, mulai dari kebutuhan pangan hingga pengelolaan limbah. Dengan menggabungkan kearifan tradisional dan inovasi teknologi, kami berupaya menciptakan ekosistem yang mendukung gaya hidup sehat dan berkelanjutan.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Kami berkomitmen untuk menyediakan informasi yang akurat, edukasi yang memberdayakan, dan produk berkualitas tinggi yang berasal dari sumber alami dan diproses secara bertanggung jawab.
          </p>
        </section>

        {/* Visi & Misi */}
        <section className="mb-12 grid md:grid-cols-2 gap-8">
          <div className="bg-green-50 p-8 rounded-xl shadow-md">
            <Target size={32} className="mb-3 text-green-600" />
            <h3 className="text-2xl font-semibold text-green-800 mb-3">Visi Kami</h3>
            <p className="text-gray-700 leading-relaxed">
              Menjadi platform terdepan dalam edukasi dan penyediaan solusi berbasis alam untuk meningkatkan kualitas hidup masyarakat dan mendukung keberlanjutan lingkungan.
            </p>
          </div>
          <div className="bg-green-50 p-8 rounded-xl shadow-md">
            <CheckCircle size={32} className="mb-3 text-green-600" />
            <h3 className="text-2xl font-semibold text-green-800 mb-3">Misi Kami</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
              <li>Menyediakan edukasi komprehensif tentang budidaya maggot dan manfaat produk herbal.</li>
              <li>Menawarkan produk alami berkualitas tinggi yang aman dan efektif.</li>
              <li>Membangun komunitas yang sadar akan pentingnya kesehatan dan kelestarian alam.</li>
              <li>Mendorong praktik berkelanjutan dalam setiap aspek operasional kami.</li>
            </ul>
          </div>
        </section>

        {/* Tim Kami (Opsional) */}
        {teamMembers && teamMembers.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-green-700 mb-8 text-center flex items-center justify-center">
              <Users size={36} className="mr-3" />
              Pengembang
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
              {teamMembers.map((member) => (
                <TeamMemberCard
                  key={member.name}
                  name={member.name}
                  role={member.role}
                  imageUrl={member.imageUrl}
                  bio={member.bio}
                />
              ))}
            </div>
          </section>
        )}

        {/* Ajakan */}
        <footer className="mt-12 text-center">
          <p className="text-gray-700 mb-4 text-lg">
            Kami senang Anda berkunjung dan ingin tahu lebih banyak tentang Magolyfe.
          </p>
          <Link 
            to="/contact"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105 inline-block"
          >
            Hubungi Kami Jika Ada Pertanyaan
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default About;
