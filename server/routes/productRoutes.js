// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductImage, // Impor fungsi baru untuk menyajikan gambar
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware'); // Pastikan path ini benar
const { uploadImage } = require('../middlewares/multerConfig'); // Gunakan uploadImage generik

// === Rute Publik ===
// GET /api/products - Mengambil semua produk (tanpa buffer gambar)
router.get('/', getProducts);

// GET /api/products/:id - Mengambil satu produk berdasarkan ID (tanpa buffer gambar)
router.get('/:id', getProductById);

// GET /api/products/:id/image - Menyajikan gambar untuk produk tertentu
router.get('/:id/image', getProductImage);


// === Rute Admin ===
// Semua rute admin di bawah ini akan memiliki prefix /api/admin/products dari server.js
// dan akan dilindungi oleh authMiddleware

// POST /api/admin/products - Membuat produk baru
router.post('/', authMiddleware, uploadImage.single('image'), createProduct);

// PUT /api/admin/products/:id - Memperbarui produk
router.put('/:id', authMiddleware, uploadImage.single('image'), updateProduct);

// DELETE /api/admin/products/:id - Menghapus produk
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
