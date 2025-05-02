const { getReviewsByCoWorkingSpace } = require('../controllers/reviews');
const Review = require('../models/Review');
const mongoose = require('mongoose');

jest.mock('../models/Review');

describe('getReviewsByCoWorkingSpace', () => {
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

  it('should return 400 if coWorkingSpaceId is missing', async () => {
    await getReviewsByCoWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "coWorkingSpaceId is required",
    });
  });

  it('should return 200 and an empty array if no reviews found', async () => {
    req.params.coWorkingSpaceId = '67c5a3ecc3e4843c9fa2671a';
    Review.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue([]),
    });

    await getReviewsByCoWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });

  it('should return 200 and the list of reviews if reviews exist', async () => {
    req.params.coWorkingSpaceId = '67c5a3ecc3e4843c9fa2671a';
    const mockReviews = [
      { _id: 'review1', comment: 'Great place!', user: { name: 'Alice' } },
    ];
    Review.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockReviews),
    });

    await getReviewsByCoWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockReviews,
    });
  });

  it('should return 500 if there is a server error', async () => {
    req.params.coWorkingSpaceId = '67c5a3ecc3e4843c9fa2671a';
    Review.find.mockImplementation(() => ({
      populate: jest.fn().mockRejectedValue(new Error('DB error')),
    }));

    await getReviewsByCoWorkingSpace(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Server error",
    });
  });
});
