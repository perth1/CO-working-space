const User = require('../models/User');
const TopUpHistory = require('../models/TopUpHistory');

exports.updateBalance = async (req, res) => {
    try {
      const { amount, chargeId } = req.body;
  
      const user = await User.findById(req.user.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      user.balance += amount / 100;
      await user.save();
  
      await TopUpHistory.create({
        amount: amount,
        chargeId: chargeId,
        userId: req.user.id,
        status: "successful",
      });
  
      res.status(200).json({ success: true });
    } catch (err) {
      console.error("❌ UPDATE BALANCE ERROR:", err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  };
  