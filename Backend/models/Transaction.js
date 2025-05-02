const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    // อ้างอิงถึงผู้ใช้ (เหมือนใน Review)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // จำนวนเงิน
    amount: {
      type: Number,
      required: true,
      min: 0 // ป้องกันค่าติดลบ
    },

    // ประเภท transaction (เพิ่มเข้ามา)
    type: {
      type: String,
      required: true,
      enum: ['topup', 'reserve', 'refund'] // กำหนดค่าได้เฉพาะ 3 แบบนี้
    }
  },
  {
    timestamps: true // สร้าง createdAt และ updatedAt อัตโนมัติ (เหมือนใน Review)
  }
);

// สร้างโมเดล
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;