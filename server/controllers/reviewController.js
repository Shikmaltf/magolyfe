// backend/controllers/reviewController.js
const Review = require('../models/Review');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    // Find all reviews and sort by the newest
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
  try {
    const { name, rating, description } = req.body;

    // Basic validation
    if (!name || !rating || !description) {
      return res.status(400).json({ message: 'Nama, rating, dan deskripsi wajib diisi.' });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating harus antara 1 dan 5.' });
    }

    const newReview = new Review({
      name,
      rating,
      description,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(' ') });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Ulasan tidak ditemukan.' });
    }

    // The auth middleware should already protect this route for admins only.
    // req.admin should be available from the middleware.
    await review.deleteOne(); // Use deleteOne() for Mongoose v6+

    res.json({ message: 'Ulasan berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};
