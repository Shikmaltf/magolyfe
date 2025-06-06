// backend/config/email.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Fungsi untuk mengirim email.
 * @param {object} options - Opsi email.
 * @param {string} options.email - Alamat email penerima.
 * @param {string} options.subject - Subjek email.
 * @param {string} options.message - Isi pesan email (teks biasa).
 * @param {string} [options.html] - Isi pesan email (HTML, opsional).
 */
const sendEmail = async (options) => {
  // 1. Membuat transporter (objek yang akan mengirim email)
  // Konfigurasi diambil dari environment variables untuk keamanan dan fleksibilitas.
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Host server SMTP (misal: smtp.gmail.com, smtp.mailtrap.io)
    port: process.env.EMAIL_PORT, // Port server SMTP (misal: 587 untuk TLS, 465 untuk SSL, 2525 untuk Mailtrap)
    secure: process.env.EMAIL_PORT === '465', // true jika port 465 (SSL), false untuk port lain (biasanya STARTTLS)
    auth: {
      user: process.env.EMAIL_USERNAME, // Username untuk autentikasi ke server email
      pass: process.env.EMAIL_PASSWORD, // Password untuk autentikasi ke server email
    },
    // Untuk layanan seperti Gmail, Anda mungkin perlu:
    // - Mengaktifkan "Less secure app access" (tidak direkomendasikan untuk produksi)
    // - Atau menggunakan "App Passwords" jika 2FA aktif.
    // Untuk produksi, layanan email transaksional seperti SendGrid, Mailgun, AWS SES lebih disarankan.
  });

  // 2. Mendefinisikan opsi-opsi email
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Admin Aplikasi Anda'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USERNAME}>`, // Alamat email pengirim (nama dan alamat)
    to: options.email, // Alamat email penerima
    subject: options.subject, // Subjek email
    text: options.message, // Isi email dalam format teks biasa
    html: options.html || `<p>${options.message.replace(/\n/g, '<br>')}</p>`, // Isi email dalam format HTML (jika disediakan), atau konversi teks biasa ke HTML sederhana
  };

  // 3. Mengirim email menggunakan transporter dan opsi yang telah didefinisikan
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email terkirim: %s', info.messageId); // Log ID pesan jika berhasil
    return info;
  } catch (error) {
    console.error('Error saat mengirim email:', error);
    throw new Error('Gagal mengirim email.'); // Melemparkan error agar bisa ditangani di pemanggil
  }
};

module.exports = sendEmail;
