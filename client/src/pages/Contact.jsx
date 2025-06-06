// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, MessageSquare } from 'lucide-react'; // Added icons

const ContactInfoItem = ({ icon, title, children }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0 text-green-600 mt-1">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <div className="text-gray-600 text-sm">{children}</div>
    </div>
  </div>
);

const Contact = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  // const [email, setEmail] = useState(''); // Email field removed as per user's latest code

  // Nomor WhatsApp Tujuan (ganti dengan nomor Anda, gunakan format internasional tanpa + atau 00)
  // Menggunakan environment variable untuk nomor WhatsApp
  const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER; // Fallback if env var is not set

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      alert("Nama dan Pesan tidak boleh kosong."); // Simple validation from user's code
      return;
    }

    if (!whatsappNumber || whatsappNumber === "6281234567890") {
        // Alert if the WhatsApp number is the placeholder or not set.
        // This is a good practice for development and to remind to set the actual number.
        alert("Nomor WhatsApp tujuan belum diatur dengan benar. Silakan periksa konfigurasi.");
        console.warn("WhatsApp number is not configured or is using the default placeholder.");
        return;
    }

    const whatsappMessage = `Halo, saya ${name},\n\n${message}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    window.open(whatsappUrl, '_blank');

    // Optionally clear the form after submission
    // setName('');
    // setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12">
          <MessageSquare size={64} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Kami senang mendengar dari Anda! Baik itu pertanyaan, masukan, atau sekadar ingin menyapa, jangan ragu untuk menghubungi tim Magolyfe.
          </p>
        </header>

        {/* Removed items-start to make columns equal height by default (stretch) */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact Form Section */}
          {/* Added h-full and flex flex-col to make inner content fill height if needed */}
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl order-2 md:order-1 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
              <Send size={28} className="mr-3 text-green-500" />
              Kirim Pesan Langsung
            </h2>
            {/* Added flex-grow to the form to push button to bottom if card is taller */}
            <form onSubmit={handleSubmit} className="space-y-5 flex flex-col flex-grow">
              <div>
                {/* Label changed from "Nama Lengkap" to "Nama" */}
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
              {/* Email input field removed */}
              {/* This div will grow, and the textarea will grow within it */}
              <div className="flex flex-col flex-grow">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Pesan Anda</label>
                <textarea
                  id="message"
                  placeholder="Tuliskan pesan Anda di sini..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  // Removed fixed h-36, added flex-grow to fill its parent, and min-h for a minimum size
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none flex-grow min-h-[9rem]" // 9rem is approx h-36
                  required
                />
              </div>
              {/* Added mt-auto to button to push it to the bottom of the form */}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg mt-auto"
              >
                <Send size={20} className="mr-2" />
                Kirim via WhatsApp
              </button>
            </form>
          </div>

          {/* Contact Information Section */}
          {/* Added h-full to ensure this column also respects the equal height */}
          <div className="bg-green-50 p-6 sm:p-8 rounded-xl shadow-xl order-1 md:order-2 space-y-6 h-full">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Informasi Kontak Lainnya
            </h2>
            <ContactInfoItem icon={<MapPin size={24} />} title="Energy of Jamaras">
              Jl. Jamaras III, Kel. Jatihandap,<br />
              Kec Mandalajati, Kota Bandung, Jawa Barat <br />
              (Kunjungan hanya dengan perjanjian)
            </ContactInfoItem>
            <hr className="border-green-200"/>
            <ContactInfoItem icon={<Phone size={20} />} title="Telepon">
              <a href="tel:+62212345678" className="hover:text-green-700 transition-colors">+62 21 2345 678</a> 
            </ContactInfoItem>
            <hr className="border-green-200"/>
            <ContactInfoItem icon={<Mail size={20} />} title="Email">
              <a href="mailto:info@magolyfe.com" className="hover:text-green-700 transition-colors">info@magolyfe.com</a>
            </ContactInfoItem>
            
             {/* Placeholder for a map, if you want to add one later */}
            {/* <div className="mt-6 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
              [Google Maps Placeholder]
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
