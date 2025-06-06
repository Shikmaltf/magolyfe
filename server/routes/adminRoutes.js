// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
    login, 
    changePassword, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware untuk proteksi rute

// Rute untuk login admin (Publik)
// POST /api/admin/login
router.post('/login', login);

// Rute untuk mengubah password admin yang sedang login (Perlu Autentikasi)
// POST /api/admin/change-password
router.post('/change-password', authMiddleware, changePassword);

// Rute untuk meminta reset password (Publik)
// POST /api/admin/forgot-password
router.post('/forgot-password', forgotPassword);

// Rute untuk mereset password menggunakan token dari email (Publik, tapi token diverifikasi)
// POST /api/admin/reset-password/:token
router.post('/reset-password/:token', resetPassword);


module.exports = router;
