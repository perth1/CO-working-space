const Review = require('../models/Review');
const mongoose = require('mongoose'); // เพิ่มถ้ายังไม่มี

// @desc     Create Review
// @route    POST /api/v1/reviews/:coWorkingSpaceId
// @access   Private
exports.createReview = async (req, res, next) => {
  const { comment  } = req.body;
  const { coWorkingSpaceId } = req.params;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Please provide a comment.',
    });
  }

  try {
    const newReview = await Review.create({
      user: req.user.id,
      coWorkingSpaceId,
      comment,
    });

    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};


// @desc    Get Review by Reservation ID
// @route   GET /api/v1/reviews/:coWorkingSpaceId
// @access  Private
exports.getReview = async (req, res) => {
  try {
    const { coWorkingSpaceId } = req.params;

    if (!coWorkingSpaceId) {
      return res.status(400).json({ success: false, message: "coWorkingSpaceId is required" });
    }

    const review = await Review.find({
      coWorkingSpaceId: new mongoose.Types.ObjectId(coWorkingSpaceId),
      user: req.user.id,
    });

    if (review.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// @desc     Edit Review
// @route    PUT /api/v1/reviews/:reviewId
// @access   Private
exports.editReview = async (req, res) => {
  const { comment } = req.body;
  const { reviewId } = req.params;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide a comment.' });
  }

  try {
    const review = await Review.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found or unauthorized' });
    }

    review.comment = comment;
    await review.save();

    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc     Delete Review
// @route    DELETE /api/v1/reviews/:reservationId
// @access   Private
exports.deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findOne({
      _id: new mongoose.Types.ObjectId(reviewId),
      user: req.user.id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully.',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc     Get Reviews by CoWorking Space ID
// @route    GET /api/v1/reviews/coworking/:coWorkingSpaceId
// @access   Private
exports.getReviewsByCoWorkingSpace = async (req, res) => {
  try {
    const { coWorkingSpaceId } = req.params;

    if (!coWorkingSpaceId) {
      return res.status(400).json({ success: false, message: "coWorkingSpaceId is required" });
    }

    const reviews = await Review.find({
      coWorkingSpaceId: new mongoose.Types.ObjectId(coWorkingSpaceId),
    }).populate('user', 'name'); // Populate user name to show along with the review

    if (reviews.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



