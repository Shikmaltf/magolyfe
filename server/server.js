// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Impor rute
const adminAuthRoutes = require('./routes/adminRoutes');
const articleRoutesForAdmin = require('./routes/articleRoutes');
const articleRoutesForPublic = require('./routes/articleRoutes');
const productRoutesForAdmin = require('./routes/productRoutes');
const productRoutesForPublic = require('./routes/productRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const multer = require('multer');

// Load environment variables
dotenv.config();

// Koneksi ke database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rute API
app.use('/api/admin', adminAuthRoutes);
app.use('/api/articles', articleRoutesForPublic);
app.use('/api/admin/articles', articleRoutesForAdmin);
app.use('/api/products', productRoutesForPublic);
app.use('/api/admin/products', productRoutesForAdmin);
app.use('/api/chatbot', chatbotRoutes);

// Penanganan Error Global
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: `File terlalu besar. Maksimum ${err.limits.fileSize / 1024 / 1024}MB diizinkan.` });
    }
    if (err.message && err.message.includes('Hanya file gambar')) {
        return res.status(400).json({ message: err.message });
    }
    return res.status(400).json({ message: `Multer error: ${err.message}`, field: err.field });
  } else if (err.message && err.message.includes('Hanya file gambar')) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Terjadi kesalahan pada server.';
    return res.status(statusCode).json({ message });
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
