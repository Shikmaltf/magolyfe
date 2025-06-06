// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama produk tidak boleh kosong'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Deskripsi produk tidak boleh kosong'],
  },
  price: {
    type: Number,
    required: [true, 'Harga produk tidak boleh kosong'],
    min: [0, 'Harga produk tidak boleh negatif'],
  },
  image: { // Menyimpan data biner gambar
    type: Buffer,
  },
  imageContentType: { // Menyimpan tipe MIME gambar
    type: String,
  },
  youtubeVideoId: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true }); // createdAt dan updatedAt akan dikelola secara otomatis

module.exports = mongoose.model('Product', productSchema);
