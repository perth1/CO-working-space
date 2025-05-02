const express = require('express');
const router = express.Router();
const { getReview, createReview, editReview, deleteReview, getReviewsByCoWorkingSpace } = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews
 */

/**
 * @swagger
 * /api/v1/reviews/{coWorkingSpaceId}:
 *   get:
 *     summary: Get a review by co-working space ID (for current user)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingSpaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-Working Space ID
 *     responses:
 *       200:
 *         description: Review fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6620f52e3ec5be9a5a2cb39a"
 *                 user:
 *                   type: string
 *                   example: "660dfb78e401b8e93cf4cde9"
 *                 coWorkingSpaceId:
 *                   type: string
 *                   example: "6610e5b93db7fda3b94c5910"
 *                 comment:
 *                   type: string
 *                   example: "Very good place"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/v1/reviews/{coWorkingSpaceId}:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingSpaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-Working Space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "dee makmak"
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "6620f52e3ec5be9a5a2cb39a"
 *                 user:
 *                   type: string
 *                 coWorkingSpaceId:
 *                   type: string
 *                 comment:
 *                   type: string
 *                   example: "nicenicenice"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   put:
 *     summary: Edit an existing review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "still good"
 *     responses:
 *       200:
 *         description: Review updated successfully
 */

/**
 * @swagger
 * /api/v1/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */

/**
 * @swagger
 * /api/v1/reviews/coworking/{coWorkingSpaceId}:
 *   get:
 *     summary: Get all reviews for a specific co-working space
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coWorkingSpaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-Working Space ID
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   comment:
 *                     type: string
 *                     example: "Enjoyed"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */

router.get('/:coWorkingSpaceId', protect, getReview);
router.post('/:coWorkingSpaceId', protect, createReview);
router.put('/:reviewId', protect, editReview);
router.delete('/:reviewId', protect, deleteReview);
router.get('/coworking/:coWorkingSpaceId', protect, getReviewsByCoWorkingSpace);

module.exports = router;
