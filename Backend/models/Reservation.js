const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reserveDate :{
        type: Date,
        required:true,
    },
    user :{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require:true
    },
    coWorkingSpace :{
        type: mongoose.Schema.ObjectId,
        ref: 'CoWorkingSpace',
        required:true
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
    cancellationDeadline: {
        type: Date, // เก็บวันที่เวลาที่สามารถยกเลิกการจองได้
        required: true,
        default: function () {
            const reservationDate = this.reserveDate;
            return new Date(reservationDate.getTime() + 24 * 60 * 60 * 1000); // 24 ชั่วโมงหลังจากที่จอง
        }
    }
    
});

module.exports = mongoose.model('Reservation',ReservationSchema);