// const Rating = require('../models/Rating');
// const CoWorkingSpace = require('../models/CoWorkingSpace');

// // @desc    Rate a co-working space by ID
// // @route   PATCH /api/v1/coworkingspaces/:id/rate
// // @access  Private
// exports.rateCoWorkingSpace = async (req, res, next) => {
//   try {
//     const { rating } = req.body;
    
//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({ success: false, msg: 'Invalid rating' });
//     }

//     const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);
//     if (!coWorkingSpace) {
//       return res.status(404).json({ success: false, msg: 'Co-working space not found' });
//     }

//     // save new rating record
//     await Rating.create({
//       coWorkingSpace: coWorkingSpace._id,
//       rating: rating,
//       user: req.user.id   // ถ้ามีระบบ auth เก็บ user id ด้วย
//     });

//     coWorkingSpace.rating = rating; // อัปเดต rating ล่าสุด (หรือไม่ทำก็ได้ถ้าเก็บแยก Rating)
//     await coWorkingSpace.save();

//     res.status(200).json({ success: true, data: coWorkingSpace });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, msg: 'Server Error' });
//   }
// };

// // @desc    Get average rating for a co-working space
// // @route   GET /api/v1/coworkingspaces/:id/average-rating
// // @access  Public
// exports.getAverageRating = async (req, res, next) => {
//   try {
//     const coworkingSpaceId = req.params.id;

//     // Find all reservations that have a rating
//     const reservations = await Reservation.find({
//       coWorkingSpace: coworkingSpaceId,
//       rating: { $ne: null }
//     });

//     const count = reservations.length;

//     if (count === 0) {
//       return res.status(200).json({ success: true, data: { averageRating: 0, count: 0 } });
//     }

//     const totalRating = reservations.reduce((sum, reservation) => sum + reservation.rating, 0);
//     const averageRating = Number((totalRating / count).toFixed(2));

//     res.status(200).json({ success: true, data: { averageRating, count } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, msg: 'Server error' });
//   }
// };
const Rating = require('../models/Rating');

exports.rateCoWorkingSpace = async (req, res) => {
  try {
    const { coWorkingSpaceId, rating } = req.body;

    let existingRating = await Rating.findOne({
      user: req.user._id,
      coWorkingSpace: coWorkingSpaceId,
    });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      await Rating.create({
        user: req.user._id,
        coWorkingSpace: coWorkingSpaceId,
        rating,
      });
    }

    res.status(200).json({ success: true, message: 'Rating submitted/updated.' });
  } catch (error) {
    console.error('Error rating:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ✅ ฟังก์ชันคำนวณค่าเฉลี่ย และจำนวน rating
exports.getAverageRating = async (req, res) => {
  try {
    const { coWorkingSpaceId } = req.params;

    const ratings = await Rating.find({ coWorkingSpace: coWorkingSpaceId });

    const total = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const count = ratings.length;
    const averageRating = count > 0 ? total / count : 0;

    res.status(200).json({
      success: true,
      data: {
        averageRating: parseFloat(averageRating.toFixed(1)),
        count,
      },
    });
  } catch (error) {
    console.error('Error getting average rating:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
