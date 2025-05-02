const express = require('express');
const {
  getCoWorkingSpaces,
  getCoWorkingSpace,
  createCoWorkingSpace,
  updateCoWorkingSpace,
  deleteCoWorkingSpace,
  rateCoWorkingSpace,
  getRatingStatus,
} = require('../controllers/coWorkingSpaces');

const reservationRouter = require('./reservations');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CoWorkingSpaces
 *   description: API for managing co-working spaces
 */

/**
 * @swagger
 * /api/v1/coWorkingSpaces:
 *   get:
 *     summary: Get all co-working spaces
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of co-working spaces
 */

/**
 * @swagger
 * /api/v1/coWorkingSpaces:
 *   post:
 *     summary: Create a new co-working space
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - open_time
 *               - close_time
 *               - price
 *               - desc
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Space 1"
 *               address:
 *                 type: string
 *                 example: "123 Payathai Rd., Bangkok"
 *               tel:
 *                 type: string
 *                 example: "0123456789"
 *               open_time:
 *                 type: string
 *                 example: "09:00"
 *               close_time:
 *                 type: string
 *                 example: "18:00"
 *               price:
 *                 type: number
 *                 example: 300
 *               desc:
 *                 type: string
 *                 example: "For 2-3 people"
 *     responses:
 *       201:
 *         description: Co-working space created successfully
 */


/**
 * @swagger
 * /api/v1/coWorkingSpaces/{id}:
 *   get:
 *     summary: Get a single co-working space by ID
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-working space ID
 *     responses:
 *       200:
 *         description: Co-working space details
 */

/**
 /**
 * @swagger
 * /api/v1/coWorkingSpaces/{id}:
 *   put:
 *     summary: Update an existing co-working space
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-working space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               tel:
 *                 type: string
 *               open_time:
 *                 type: string
 *               close_time:
 *                 type: string
 *               price:
 *                 type: number
 *               desc:
 *                 type: string
 *     responses:
 *       200:
 *         description: Co-working space updated successfully
 */


/**
 * @swagger
 * /api/v1/coWorkingSpaces/{id}:
 *   delete:
 *     summary: Delete a co-working space
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-working space ID
 *     responses:
 *       200:
 *         description: Co-working space deleted successfully
 */

/**
 * @swagger
 * /api/v1/coWorkingSpaces/{id}/rate:
 *   patch:
 *     summary: Rate a co-working space
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-working space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 */

/**
 * @swagger
 * /api/v1/coWorkingSpaces/{id}/rating-status:
 *   get:
 *     summary: Get current user's rating status for a co-working space
 *     tags: [CoWorkingSpaces]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Co-working space ID
 *     responses:
 *       200:
 *         description: User's rating status
 */

router
  .route('/:id/rate')
  .patch(protect, rateCoWorkingSpace);

router
  .route('/:id/rating-status')
  .get(protect, getRatingStatus);

router.use('/:coWorkingSpaceId/reservations/', reservationRouter);

router.route('/')
  .get(protect, getCoWorkingSpaces)
  .post(protect, authorize('admin'), createCoWorkingSpace);

router.route('/:id')
  .get(protect, getCoWorkingSpace)
  .put(protect, authorize('admin'), updateCoWorkingSpace)
  .delete(protect, authorize('admin'), deleteCoWorkingSpace);

module.exports = router;
