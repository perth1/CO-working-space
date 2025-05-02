const express = require('express');
const { protect } = require('../middleware/auth');
const { updateBalance } = require('../controllers/payment');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: APIs related to payment and balance updates
 */

/**
 * @swagger
 * /api/v1/payment/updateBalance:
 *   post:
 *     summary: Update user's balance after top-up
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to add to user's balance (Baht)
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Balance updated successfully
 *       400:
 *         description: Invalid request or missing fields
 *       401:
 *         description: Unauthorized (no token provided)
 */
router.post('/updateBalance', protect, updateBalance);

module.exports = router;
