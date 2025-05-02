const CoWorkingSpace = require('../models/CoWorkingSpace');

//@desc     Get all coWorkingSpaces
//@route    GET /api/v1/coWorkingSpaces
//@access   Public
exports.getCoWorkingSpaces= async(req,res,next)=>{
    let query;
    //Copy query
    const reqQuery = {...req.query};

    //Fields to exclude
    const removeFields =['select','sort','page','limit'];

    //Loop over remove fields and delete hwm from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //Finding resource
    query = CoWorkingSpace.find(JSON.parse(queryStr)).populate('reservations');

    //Select Fields
    if(req.query.select){
        const fields =req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else{
        query = query.sort('-createdAt');
    }
    //Pagination
    const page =parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await CoWorkingSpace.countDocuments();

    query = query.skip(startIndex).limit(limit);
    //Executing query
    try{
        const coWorkingSpace = await query;
        //pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page : page + 1,
                limit
            }
        }

        if(startIndex > 0){
            pagination.prev = {
                page : page - 1,
                limit
            }
        }
        res.status(200).json({success:true, count:coWorkingSpace.length, pagination, data: coWorkingSpace});
    } catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Get single coWorkingSpaces
//@route    GET /api/v1/coWorkingSpaces/:id
//@access   Public
exports.getCoWorkingSpace = async (req,res,next)=>{
    try{
        const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);

        if(!coWorkingSpace){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:coWorkingSpace});
    } catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     Create a coWorkingSpace
//@route    POST /api/v1/coWorkingSpaces
//@access   Private
exports.createCoWorkingSpace = async (req,res,next)=>{
    const coWorkingSpace = await CoWorkingSpace.create(req.body);
    console.log(req.body);
    res.status(201).json({success: true, data:coWorkingSpace });
};

//@desc    Update a coWorkingSpace
//@route   PUT /api/v1/coWorkingSpace/:id
//@access  Private
exports.updateCoWorkingSpace = async (req,res,next)=>{
    try{
        const coWorkingSpace = await CoWorkingSpace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!coWorkingSpace){ 
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:coWorkingSpace});
    } catch(err){
        res.status(400).json({success:false});
    }
};

const Reservation = require('../models/Reservation');

//@desc    Delete a coWorkingSpace
//@route   DELETE/api/v1/coWorkingSpace/:id
//@access  Private
exports.deleteCoWorkingSpace = async (req,res,next)=>{
    try{
        const coWorkingSpace = await CoWorkingSpace.findById(req.params.id);

        if(!coWorkingSpace){
            return res.status(400).json({success:false,message:`Co-working space not found with id of ${req.params.id}`});
        }
        
        await Reservation.deleteMany({coWorkingSpace: req.params.id});
        await CoWorkingSpace.deleteOne({_id: req.params.id});
        
        res.status(200).json({success:true, data:{}});
    } catch(err){
        res.status(400).json({success:false}); 
    }
};

const Rating = require('../models/Rating');

// PATCH /api/v1/coWorkingSpaces/:id/rate
exports.rateCoWorkingSpace = async (req, res) => {
  const coWorkingSpaceId = req.params.id;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    const hasReservation = await Reservation.findOne({
      user: userId,
      coWorkingSpace: coWorkingSpaceId,
    });

    if (!hasReservation) {
      return res.status(403).json({
        success: false,
        message: "You must reserve this space before rating.",
      });
    }

    let ratingRecord = await Rating.findOne({
      user: userId,
      coWorkingSpace: coWorkingSpaceId,
    });

    if (ratingRecord) {
      ratingRecord.rating = rating;
      await ratingRecord.save();
    } else {
      ratingRecord = await Rating.create({
        user: userId,
        coWorkingSpace: coWorkingSpaceId,
        rating,
      });
    }

    const allRatings = await Rating.find({ coWorkingSpace: coWorkingSpaceId });
    const averageRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await CoWorkingSpace.findByIdAndUpdate(coWorkingSpaceId, {
      averageRating,
    });

    res.status(200).json({
      success: true,
      message: "Rating submitted",
      rating,
    });
  } catch (error) {
    console.error("Rating error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error });
  }
};


// GET /api/v1/coWorkingSpaces/:id/rating-status
exports.getRatingStatus = async (req, res) => {
    const coWorkingSpaceId = req.params.id;
    const userId = req.user.id;
  
    try {
      const hasReservation = await Reservation.findOne({
        user: userId,
        coWorkingSpace: coWorkingSpaceId,
      });
  
      if (!hasReservation) {
        return res.status(200).json({ hasReserved: false });
      }
  
      const ratingRecord = await Rating.findOne({
        user: userId,
        coWorkingSpace: coWorkingSpaceId,
      });
  
      res.status(200).json({
        hasReserved: true,
        rating: ratingRecord ? ratingRecord.rating : null,
      });
    } catch (error) {
      console.error("Rating status error:", error);
      res
        .status(500)
        .json({ success: false, message: "Server error" });
    }
  };
  
