// createReview.test.ts
const { createReview } = require('../controllers/reviews.js'); 
const Review = require('../models/Review');

jest.mock('../models/Review', () => ({
    create: jest.fn(),
  }));

describe('createReview', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 'user123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should return 400 if comment is missing', async () => {
    req.body.comment = '';

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide a comment.',
    });
  });

  it('should return 400 if comment is only spaces', async () => {
    req.body.comment = '   ';

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Please provide a comment.',
    });
  });

  it('should create a review and return 201', async () => {
    req.body.comment = 'Great place!';
    req.params.coWorkingSpaceId = 'cowork123';

    const mockReview = { id: 'review123', comment: 'Great place!' };
    Review.create.mockResolvedValue(mockReview);

    await createReview(req, res, next);

    expect(Review.create).toHaveBeenCalledWith({
      user: 'user123',
      coWorkingSpaceId: 'cowork123',
      comment: 'Great place!',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockReview,
    });
  });

  it('should return 500 if there is a server error', async () => {
    req.body.comment = 'Nice!';
    req.params.coWorkingSpaceId = 'cowork123';

    Review.create.mockRejectedValue(new Error('DB error'));

    await createReview(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Server Error',
    });
  });
});
