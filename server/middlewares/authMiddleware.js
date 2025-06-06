// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Cek apakah header Authorization ada dan menggunakan skema Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // console.log('Auth Middleware: No token or malformed header. Header:', authHeader); // Untuk debugging
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ada atau format header salah.' });
  }

  // 2. Ambil token murni (setelah "Bearer ")
  const token = authHeader.split(' ')[1];

  if (!token) {
    // console.log('Auth Middleware: Token missing after Bearer prefix.'); // Untuk debugging
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan setelah prefix Bearer.' });
  }

  try {
    // Pastikan JWT_SECRET Anda ada dan benar di file .env dan dimuat dengan dotenv
    if (!process.env.JWT_SECRET) {
      console.error('KRITIS: JWT_SECRET tidak terdefinisi di variabel lingkungan!');
      return res.status(500).json({ message: 'Kesalahan konfigurasi server: JWT_SECRET tidak ada.' });
    }
    // console.log('Auth Middleware: Verifying token:', token); // Untuk debugging
    // console.log('Auth Middleware: Using JWT_SECRET (first 5 chars):', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0,5) + '...' : 'NOT SET'); // HATI-HATI: Jangan log secret penuh di produksi

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 'decoded' akan berisi payload dari token JWT Anda.
    // Misalnya, jika saat membuat token Anda menyertakan { userId: '123', role: 'admin' }
    // maka decoded akan menjadi objek tersebut.
    // Anda bisa menyematkan seluruh objek decoded atau bagian spesifik ke req.
    // Contoh: req.admin = decoded; atau req.userId = decoded.userId;
    // Sesuaikan 'req.admin = decoded' dengan struktur payload token Anda.
    // Jika payload token Anda adalah { admin: { id: ..., username: ... } }, maka gunakan decoded.admin.
    // Jika payload token Anda langsung berisi data admin, maka 'decoded' sudah cukup.
    req.admin = decoded; // Ini mengasumsikan payload token langsung berisi data admin yang relevan.

    next(); // Lanjutkan ke controller jika token valid
  } catch (err) {
    // console.error('Auth Middleware: Token verification error:', err.name, err.message); // Untuk debugging
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token tidak valid: Format atau tanda tangan salah.' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token tidak valid: Token sudah kedaluwarsa.' });
    }
    // Untuk error verifikasi lainnya yang tidak terduga
    return res.status(401).json({ message: 'Token tidak valid.' });
  }
};

module.exports = authMiddleware;
