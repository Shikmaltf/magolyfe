// backend/models/Article.js
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul artikel tidak boleh kosong'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Isi artikel tidak boleh kosong'],
  },
  image: { // Menyimpan data biner gambar
    type: Buffer,
  },
  imageContentType: { // Menyimpan tipe MIME gambar, e.g., 'image/jpeg', 'image/png'
    type: String,
  },
  youtubeVideoId: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true }); // createdAt dan updatedAt akan dikelola secara otomatis

module.exports = mongoose.model('Article', articleSchema);
