// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getReviews, createReview, deleteReview } = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.route('/').get(getReviews).post(createReview);

// Private/Admin route
router.route('/:id').delete(authMiddleware, deleteReview);

module.exports = router;
