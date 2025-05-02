const TopUpHistory = require("../models/TopUpHistory");

exports.getTopUpHistory = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const history = await TopUpHistory.find({ userId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: history });

  } catch (error) {
    console.error("❌ GET TOPUP HISTORY ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
