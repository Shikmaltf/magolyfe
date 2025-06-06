// backend/controllers/adminController.js
const Admin = require('../models/Admin'); // Model Admin
const jwt =require('jsonwebtoken'); // Untuk membuat JSON Web Token
const bcrypt = require('bcrypt'); // Untuk hashing dan perbandingan password
const crypto = require('crypto'); // Modul kriptografi bawaan Node.js (untuk token reset)
const sendEmail = require('../config/email'); // Utilitas pengiriman email
const dotenv = require('dotenv');
dotenv.config();

// @desc    Login Admin
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validasi input dasar
    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi.' });
    }

    // Cari admin berdasarkan username
    const admin = await Admin.findOne({ username });
    if (!admin) {
      // Pesan error generik untuk keamanan (tidak memberitahu field mana yang salah)
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    // Bandingkan password yang diinput dengan hash di database menggunakan method dari model
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Kredensial tidak valid.' });
    }

    // Jika kredensial cocok, buat token JWT
    // Payload token bisa berisi informasi apa pun yang Anda anggap perlu (misal: id, role)
    const token = jwt.sign(
        { id: admin._id, username: admin.username }, // Payload
        process.env.JWT_SECRET, // Kunci rahasia dari .env
        { expiresIn: '1h' } // Token berlaku selama 1 jam
    );

    res.json({
      message: 'Login berhasil.',
      token,
      admin: { // Opsional: kirim beberapa data admin non-sensitif
        id: admin._id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat proses login.' });
  }
};

// @desc    Ubah Password Admin (yang sedang login)
// @route   POST /api/admin/change-password
// @access  Private (membutuhkan token autentikasi)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const adminId = req.admin.id; // ID admin didapat dari token (via authMiddleware)

    // Validasi input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Password baru dan konfirmasi password tidak cocok.' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password baru minimal harus 6 karakter.' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      // Seharusnya tidak terjadi jika token valid, tapi sebagai pengaman
      return res.status(404).json({ message: 'Admin tidak ditemukan.' });
    }

    // Verifikasi password saat ini
    const isMatch = await admin.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password saat ini salah.' });
    }

    // Update password dengan password baru
    // Hashing password baru akan ditangani oleh pre-save hook di model Admin
    admin.password = newPassword;
    await admin.save(); // Menyimpan perubahan, pre-save hook akan berjalan

    res.json({ message: 'Password berhasil diubah.' });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat mengubah password.' });
  }
};

// @desc    Lupa Password Admin (meminta reset)
// @route   POST /api/admin/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ message: 'Username wajib diisi.' });
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      // PENTING: Jangan memberitahu apakah username ada atau tidak untuk alasan keamanan.
      // Email dikirim ke alamat statis, jadi pesan sukses generik sudah cukup.
      console.warn(`Permintaan reset password untuk username yang tidak ada: ${username}`);
      return res.status(200).json({ message: `Jika username Anda valid, instruksi untuk mereset password akan dikirim ke email admin yang terdaftar.` });
    }

    // Generate token reset password (token mentah dan token yang di-hash)
    const resetToken = crypto.randomBytes(32).toString('hex'); // Token yang akan dikirim via email

    // Simpan versi hash dari token ke database untuk keamanan
    admin.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    admin.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token berlaku 10 menit

    await admin.save({ validateBeforeSave: false }); // Simpan token dan waktu kedaluwarsa

    // Kirim email dengan link reset ke email admin statis yang ada di .env
    const staticAdminEmail = process.env.STATIC_ADMIN_EMAIL;
    if (!staticAdminEmail) {
        console.error("KRITIS: STATIC_ADMIN_EMAIL tidak terdefinisi di .env");
        return res.status(500).json({ message: 'Kesalahan konfigurasi server: Email admin tidak diatur.' });
    }
    
    // Buat URL reset, pastikan FRONTEND_URL di .env sudah benar
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const message = `Halo Admin,\n\nAnda (atau seseorang) meminta reset password untuk username: ${admin.username}.\nSilakan klik link berikut, atau salin dan tempel ke browser Anda untuk menyelesaikan proses dalam 10 menit:\n\n${resetURL}\n\nJika Anda tidak meminta ini, abaikan email ini dan password Anda akan tetap aman.\n`;

    try {
      await sendEmail({
        email: staticAdminEmail,
        subject: 'Permintaan Reset Password Admin',
        message,
      });
      console.log(`Email reset password untuk user ${username} telah dikirim ke email admin statis.`);
      res.status(200).json({ message: `Instruksi untuk mereset password username '${username}' telah dikirim ke alamat email admin yang ditunjuk.` });
    } catch (emailError) {
      console.error("Lupa password - error pengiriman email:", emailError);
      // Jika email gagal dikirim, hapus token dari DB agar tidak membingungkan
      admin.passwordResetToken = undefined;
      admin.passwordResetExpires = undefined;
      await admin.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Gagal mengirim email reset password. Silakan coba lagi nanti.' });
    }

  } catch (error) {
    console.error("Lupa password - error utama:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat proses lupa password.' });
  }
};

// @desc    Reset Password Admin (setelah klik link di email)
// @route   POST /api/admin/reset-password/:token
// @access  Public (tapi membutuhkan token valid)
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Token dari URL
    const { password, confirmPassword } = req.body;

    // Validasi input
    if (!password || !confirmPassword) {
        return res.status(400).json({ message: 'Password baru dan konfirmasi password wajib diisi.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Password baru dan konfirmasi password tidak cocok.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password baru minimal harus 6 karakter.' });
    }

    // Hash token yang diterima dari URL untuk dicocokkan dengan yang ada di DB
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Cari admin berdasarkan token yang sudah di-hash dan belum kedaluwarsa
    const admin = await Admin.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Token belum kedaluwarsa
    });

    if (!admin) {
      return res.status(400).json({ message: 'Token reset password tidak valid atau sudah kedaluwarsa.' });
    }

    // Jika token valid, set password baru dan hapus token reset
    admin.password = password; // Hashing akan ditangani oleh pre-save hook
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    // Opsional: bisa juga langsung login admin di sini dengan membuat JWT baru
    // Untuk kesederhanaan, kita minta mereka login manual.
    res.json({ message: 'Password berhasil direset. Anda sekarang bisa login dengan password baru Anda.' });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat proses reset password.' });
  }
};
