// backend/routes/articleRoutes.js
const express = require('express');
const router = express.Router();
const {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleById,
  getArticleImage, // Impor fungsi baru untuk menyajikan gambar
} = require('../controllers/articleController');
const authMiddleware = require('../middlewares/authMiddleware'); // Pastikan path ini benar
const { uploadImage } = require('../middlewares/multerConfig'); // Gunakan uploadImage generik

// === Rute Publik ===
// GET /api/articles - Mengambil semua artikel (tanpa buffer gambar)
router.get('/', getArticles);

// GET /api/articles/:id - Mengambil satu artikel berdasarkan ID (tanpa buffer gambar)
router.get('/:id', getArticleById);

// GET /api/articles/:id/image - Menyajikan gambar untuk artikel tertentu
router.get('/:id/image', getArticleImage);


// === Rute Admin ===
// Semua rute admin di bawah ini akan memiliki prefix /api/admin/articles dari server.js
// dan akan dilindungi oleh authMiddleware

// POST /api/admin/articles - Membuat artikel baru
router.post('/', authMiddleware, uploadImage.single('image'), createArticle);

// PUT /api/admin/articles/:id - Memperbarui artikel
router.put('/:id', authMiddleware, uploadImage.single('image'), updateArticle);

// DELETE /api/admin/articles/:id - Menghapus artikel
router.delete('/:id', authMiddleware, deleteArticle);

// GET /api/admin/articles (opsional, jika perlu endpoint admin terpisah untuk list)
// router.get('/admin-list', authMiddleware, getArticles); // Contoh jika ingin list admin yg berbeda

// GET /api/admin/articles/:id (opsional, jika perlu endpoint admin terpisah untuk detail)
// router.get('/admin-detail/:id', authMiddleware, getArticleById); // Contoh jika ingin detail admin yg berbeda


module.exports = router;
