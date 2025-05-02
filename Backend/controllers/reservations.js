const Reservation = require('../models/Reservation');
const CoWorkingSpace = require('../models/CoWorkingSpace');
const User = require('../models/User');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);


//@desc     Get All reservations
//@route    GET /api/v1/reservations
//@access   Private
exports.getReservations = async (req, res, next) => {
  let query;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // เซ็ตเวลาเป็นเที่ยงคืนของวันนี้เพื่อความแม่นยำ

  try {
      if (req.user.role !== 'admin') {
          query = Reservation.find({ 
              user: req.user.id,
              reserveDate: { $gte: today } // เฉพาะจองที่ยังไม่ผ่านไป
          })
          .populate({
              path: 'coWorkingSpace',
              select: 'name address tel',
          })
          .populate({
              path: 'user',
              select: 'name email',
          });
      } else {
          if (req.params.coWorkingSpaceId) {
              query = Reservation.find({ 
                  coWorkingSpace: req.params.coWorkingSpaceId,
                  reserveDate: { $gte: today }
              })
              .populate({
                  path: 'coWorkingSpace',
                  select: 'name address tel',
              })
              .populate({
                  path: 'user',
                  select: 'name email',
              });
          } else {
              query = Reservation.find({ 
                  reserveDate: { $gte: today }
              })
              .populate({
                  path: 'coWorkingSpace',
                  select: 'name address tel',
              })
              .populate({
                  path: 'user',
                  select: 'name email',
              });
          }
      }

      const reservations = await query;

      res.status(200).json({
          success: true,
          count: reservations.length,
          data: reservations,
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Cannot find Reservations' });
  }
};


//@desc     Get single reservation
//@route    GET /api/v1/reservations/:id
//@access   Private
exports.getReservation = async(req,res,next)=>{
    try{
        const reservation = await Reservation.findById(req.params.id).populate({
            path:'coWorkingSpace',
            select:'name address tel'
        });

        if(!reservation){
            return res.status(400).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }
        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:'Cannot find Reservation'})
    }
};
//@desc     Add Reservations
//@route    POST /api/v1/coWorkingSpaces/:coWorkingSpaceId/reservations
//@access   Private
exports.addReservation = async(req,res,next)=>{
    try{
        req.body.coWorkingSpace = req.params.coWorkingSpaceId;

        const coWorkingSpace = await CoWorkingSpace.findById(req.params.coWorkingSpaceId);
        if(!coWorkingSpace){
            return res.status(400).json({success:false,message:`No coWorkingSpace with the id of ${req.params.coWorkingSpaceId}`});
        }
        //Add user Id to req.body
        req.body.user = req.user.id;

        //Check for existed reservation
        // const existedReservation = await Reservation.find({user:req.user.id});
        // //If the user is not an admin, they can only create 3 reservation.
        // if(existedReservation.length >= 3 && req.user.role !== 'admin'){
        //     return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 reservations`});
        // }

         // **หา User ก่อนเพื่อตรวจ balance**
         const user = await User.findById(req.user.id);
         if (!user) {
             return res.status(404).json({ success: false, message: "User not found" });
         }
 
         // เช็กว่ามี balance พอไหม
         if (user.balance < coWorkingSpace.price) {
             return res.status(400).json({ success: false, message: "Insufficient balance, please top-up" });
         }
 
         // หัก balance
         user.balance -= coWorkingSpace.price;
         await user.save(); // Save balance ใหม่ใน database

        const reservation = await Reservation.create(req.body);
        res.status(201).json({
            success:true,
            data: reservation
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot create Reservation'})
    }
};

//@desc     Update reservations
//@route    PUT /api/v1/reservations/:id
//@access   Private
exports.updateReservation = async(req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString() !== req.user.id&&req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`});
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch(error){
        console.log(error.stack);
        return res.status(500).json({success:false,message:'Cannot update Reservation'})
    }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ success: false, message: `No reservation with the id of ${req.params.id}` });
    }

    // Check if the user is the reservation owner
    if (reservation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to cancel this reservation` });
    }

    const currentDate = dayjs(); // ใช้ dayjs เพื่อหาวันที่ปัจจุบัน
    const reserveDate = dayjs(reservation.reserveDate); // วันที่จอง

    // เช็กว่าเป็นวันที่จองในวันนี้หรือไม่
    if (reserveDate.isSame(currentDate, 'day')) {
      // ถ้าเป็นวันเดียวกับที่จองก็สามารถยกเลิกได้ แต่ไม่คืนเงิน
      await reservation.deleteOne();  // ลบการจอง
      return res.status(200).json({
        success: true,
        message: "Reservation canceled successfully, no refund provided"
      });
    }

    // ถ้าเป็นวันที่ก่อนหน้านี้ ก็ไม่สามารถยกเลิกได้
    if (reserveDate.isBefore(currentDate, 'day')) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel past reservations"
      });
    }

    // ถ้าเป็นวันที่จองหลังจากวันนี้ สามารถยกเลิกและคืนเงินได้
    const user = await User.findById(reservation.user);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const coWorkingSpace = await CoWorkingSpace.findById(reservation.coWorkingSpace);
    if (!coWorkingSpace) {
      return res.status(404).json({ success: false, message: "Co-Working Space not found" });
    }

    const price = parseFloat(coWorkingSpace.price);
    const currentBalance = parseFloat(user.balance);

    if (isNaN(price) || isNaN(currentBalance)) {
      return res.status(400).json({ success: false, message: "Invalid price or balance" });
    }

    // คืนเงินให้ user
    user.balance = currentBalance + price;
    await user.save();

    // ลบการจอง
    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Reservation canceled and refunded successfully"
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Could not cancel the reservation' });
  }
};

  

