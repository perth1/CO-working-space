const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create transaction (แบบเดิมแต่เพิ่ม validation)
// @route   POST /api/v1/transactions
exports.createTransaction = async (req, res) => {
  try {
    const { amount, type } = req.body;

    // Validate type
    const validTypes = ['topup', 'reserve', 'refund'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid transaction type. Must be topup/reserve/refund' 
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      type
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};