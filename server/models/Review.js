// backend/models/Review.js
const mongoose = require('mongoose');

// Schema for reviews
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nama wajib diisi.'],
    trim: true,
  },
  rating: {
    type: Number,
    required: [true, 'Rating wajib diisi.'],
    min: 1,
    max: 5,
  },
  description: {
    type: String,
    required: [true, 'Deskripsi ulasan wajib diisi.'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
