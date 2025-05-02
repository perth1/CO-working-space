const mongoose = require('mongoose');

const TopUpHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  chargeId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.TopUpHistory || mongoose.model('TopUpHistory', TopUpHistorySchema);
