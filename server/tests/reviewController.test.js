const reviewController = require('../controllers/reviewController');
const Review = require('../models/Review');

// **FIX**: Gunakan module factory untuk mock constructor
const mockReviewSave = jest.fn();
jest.mock('../models/Review', () => {
  return jest.fn().mockImplementation(() => {
    return { save: mockReviewSave };
  });
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Review Controller', () => {
  let req, res;

  beforeEach(() => {
    res = mockResponse();
    req = { body: {}, params: {} };
    mockReviewSave.mockClear();
    Review.mockClear();
    jest.clearAllMocks();
  });

  // Test untuk getReviews
  describe('getReviews', () => {
    it('should return all reviews sorted by creation date', async () => {
      const mockReviews = [{ name: 'John Doe', rating: 5 }];
      Review.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockReviews),
      });

      await reviewController.getReviews(req, res);

      expect(Review.find).toHaveBeenCalled();
      expect(Review.find().sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.json).toHaveBeenCalledWith(mockReviews);
    });
  });

    // Test untuk createReview
  describe('createReview', () => {
    it('should create a new review', async () => {
      req.body = { name: 'Jane Doe', rating: 4, description: 'Good!' };
      const savedReview = { ...req.body, _id: 'r1' };
      mockReviewSave.mockResolvedValue(savedReview);

      await reviewController.createReview(req, res);

      expect(Review).toHaveBeenCalledTimes(1);
      expect(mockReviewSave).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(savedReview);
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = { name: 'Jane Doe' }; // Rating dan deskripsi tidak ada

      await reviewController.createReview(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nama, rating, dan deskripsi wajib diisi.' });
    });
  });

  // Test untuk deleteReview
  describe('deleteReview', () => {
    it('should delete a review', async () => {
      req.params.id = 'r1';
      const mockReviewInstance = {
        _id: 'r1',
        deleteOne: jest.fn().mockResolvedValue(true),
      };
      Review.findById = jest.fn().mockResolvedValue(mockReviewInstance);

      await reviewController.deleteReview(req, res);

      expect(Review.findById).toHaveBeenCalledWith('r1');
      expect(mockReviewInstance.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Ulasan berhasil dihapus.' });
    });

    it('should return 404 if review to delete is not found', async () => {
      req.params.id = 'r999';
      Review.findById = jest.fn().mockResolvedValue(null);

      await reviewController.deleteReview(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ulasan tidak ditemukan.' });
    });
  });
});