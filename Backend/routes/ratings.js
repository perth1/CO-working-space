const express = require('express');
const { rateCoWorkingSpace, getAverageRating } = require('../controllers/ratings');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ratings
 *   description: APIs for rating co-working spaces
 */

/**
 * @swagger
 * /api/v1/ratings:
 *   post:
 *     summary: Rate a co-working space
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coWorkingSpaceId
 *               - rating
 *             properties:
 *               coWorkingSpaceId:
 *                 type: string
 *                 description: ID of the co-working space to rate
 *                 example: "dd34768gh9342"
 *               rating:
 *                 type: number
 *                 description: Rating score (1-5)
 *                 example: 4
 *     responses:
 *       201:
 *         description: Rating submitted successfully
 *       400:
 *         description: Invalid request or already rated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/ratings/average/{coWorkingSpaceId}:
 *   get:
 *     summary: Get average rating for a co-working space
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: coWorkingSpaceId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the co-working space
 *     responses:
 *       200:
 *         description: Successfully fetched average rating
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   description: Average rating
 *                   example: 4.2
 *                 count:
 *                   type: integer
 *                   description: Number of ratings
 *                   example: 5
 *       404:
 *         description: Co-working space not found
 */

router.post('/', protect, rateCoWorkingSpace);
router.get('/average/:coWorkingSpaceId', getAverageRating);

module.exports = router;
