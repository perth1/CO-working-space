const express = require('express');
const { getTopUpHistory } = require('../controllers/topupHistory');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TopUpHistory
 *   description: API for managing top-up history
 */

/**
 * @swagger
 * /api/v1/topupHistory:
 *   get:
 *     summary: Get user's top-up history
 *     tags: [TopUpHistory]
 *     responses:
 *       200:
 *         description: List of top-up transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Auto-generated ID
 *                     example: "6615b4fc3dbeaab76b3e4e88"
 *                   userId:
 *                     type: string
 *                     description: ID of the user who top-up
 *                     example: "660dfb78e401b8e93cf4cde9"
 *                   amount:
 *                     type: number
 *                     description: Amount of top-up in Baht
 *                     example: 500
 *                   chargeId:
 *                     type: string
 *                     description: Unique charge ID from payment gateway
 *                     example: "chrg_test_63jjhlokmuzw4ra2gad"
 *                   status:
 *                     type: string
 *                     description: Status of payment
 *                     example: "successful"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Top-up created time
 *                     example: "2024-04-29T12:00:00.000Z"
 */

router.get('/', getTopUpHistory);

module.exports = router;
