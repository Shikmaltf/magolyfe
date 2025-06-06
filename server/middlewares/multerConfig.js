// backend/middleware/multerConfig.js
const multer = require('multer');

// Menggunakan memoryStorage untuk menyimpan file sebagai Buffer di memori
const memoryStorage = multer.memoryStorage();

// Filter file untuk hanya menerima gambar
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    // Tolak file jika bukan gambar, dengan pesan error yang lebih spesifik
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Hanya file gambar (image/*) yang diizinkan!'), false);
  }
};

// Batas ukuran file (misalnya, 5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

// Middleware upload untuk artikel dan produk sekarang menggunakan memoryStorage
const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: limits,
});

module.exports = {
  uploadImage
};
