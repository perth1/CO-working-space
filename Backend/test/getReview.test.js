const { getReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const mongoose = require('mongoose');

jest.mock('../models/Review');

describe('getReview', () => {
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
    console.error = jest.fn();
  });

  it('should return 400 if coWorkingSpaceId is not provided', async () => {
    req.params.coWorkingSpaceId = '';

    await getReview(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "coWorkingSpaceId is required",
    });
  });

  it('should return 200 and an empty array if no reviews are found', async () => {
    req.params.coWorkingSpaceId = '67c5a3ecc3e4843c9fa2671a'; // coWorkingSpaceId from database
    Review.find.mockResolvedValue([]);

    await getReview(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });

  it('should return 200 and the reviews found', async () => {
    req.params.coWorkingSpaceId = '67c5a3ecc3e4843c9fa2671a'; // coWorkingSpaceId from database
    const mockReview = [{ id: 'review123', comment: 'Great place!' }];
    Review.find.mockResolvedValue(mockReview);

    await getReview(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockReview,
    });
  });

  it('should return 500 if there is a database error', async () => {
    req.params.coWorkingSpaceId = '67c5a3ecc3e4843c9fa2671a';
    Review.find.mockRejectedValue(new Error('DB error'));

    await getReview(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server error',
    });
  });
});
