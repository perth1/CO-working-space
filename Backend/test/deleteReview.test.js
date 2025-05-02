const { deleteReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const mongoose = require('mongoose');

jest.mock('../models/Review');

describe('deleteReview', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      user: { id: 'user123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should return 404 if review not found', async () => {
    req.params.reviewId = '67c5a3ecc3e4843c9fa2671a';
    Review.findOne.mockResolvedValue(null); // Mock review not found

    await deleteReview(req, res);

    expect(Review.findOne).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId('67c5a3ecc3e4843c9fa2671a'),
      user: 'user123',
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Review not found',
    });
  });

  it('should delete the review and return 200', async () => {
    req.params.reviewId = '67c5a3ecc3e4843c9fa2671a';
    const mockReview = { deleteOne: jest.fn().mockResolvedValue(true) };
    Review.findOne.mockResolvedValue(mockReview);

    await deleteReview(req, res);

    expect(mockReview.deleteOne).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Review deleted successfully.',
    });
  });

  it('should return 500 if there is a server error', async () => {
    req.params.reviewId = '67c5a3ecc3e4843c9fa2671a';
    Review.findOne.mockRejectedValue(new Error('DB error'));

    await deleteReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server Error',
    });
  });
});
