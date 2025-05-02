const { editReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const mongoose = require('mongoose');

jest.mock('../models/Review');

describe('editReview', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'user123' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return 400 if comment is missing or empty', async () => {
    req.body.comment = '';

    await editReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide a comment.',
    });
  });

  it('should return 404 if review not found', async () => {
    req.body.comment = 'Updated comment';
    req.params.reviewId = '67c5a3ecc3e4843c9fa2671a';
    Review.findOne.mockResolvedValue(null);

    await editReview(req, res);

    expect(Review.findOne).toHaveBeenCalledWith({
      _id: new mongoose.Types.ObjectId('67c5a3ecc3e4843c9fa2671a'),
      user: 'user123',
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Review not found or unauthorized',
    });
  });

  it('should update the comment and return 200 with updated review', async () => {
    req.body.comment = 'Updated comment';
    req.params.reviewId = '67c5a3ecc3e4843c9fa2671a';
    const mockReview = { comment: 'Old comment', save: jest.fn().mockResolvedValue(true) };
    Review.findOne.mockResolvedValue(mockReview);

    await editReview(req, res);

    expect(mockReview.comment).toBe('Updated comment');
    expect(mockReview.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockReview,
    });
  });

  it('should return 500 if there is a server error', async () => {
    req.body.comment = 'Updated comment';
    req.params.reviewId = '67c5a3ecc3e4843c9fa2671a';
    Review.findOne.mockRejectedValue(new Error('DB Error'));

    await editReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server Error',
    });
  });
});
