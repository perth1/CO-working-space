const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coworking Space API",
      version: "1.0.0",
      description: "API documentation for coworking space system",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ['name', 'email', 'tel', 'password'],
          properties: {
            _id: { type: "string", description: "MongoDB ID", example: "66116fc2c1d24f3d5f34b2b3" },
            name: { type: "string", description: "User's name", example: "Phrim" },
            email: { type: "string", description: "Email address", example: "phrim@gmail.com" },
            tel: { type: "string", description: "Phone number", example: "0123456789" },
            role: { type: "string", enum: ["user", "admin"], description: "Role of user", example: "user" },
            balance: { type: "number", description: "Balance in Baht", example: 500 },
            resetPasswordToken: { type: "string", nullable: true, description: "Reset token", example: "xxxx" },
            resetPasswordExpire: { type: "string", format: "date-time", nullable: true, description: "Token expiry", example: "2025-05-01T12:00:00Z" },
            createdAt: { type: "string", format: "date-time", description: "Account creation date", example: "2025-04-01T14:20:00Z" },
          },
        },
        CoWorkingSpace: {
          type: "object",
          required: ['name', 'address', 'open_time', 'close_time', 'price', 'desc'],
          properties: {
            _name: {
              type: 'string',
              description: 'ชื่อของ Co-working Space',
              maxLength: 50,
              example: 'WeWork Central',
            },
            address: {
              type: 'string',
              description: 'ที่อยู่ของ Co-working Space',
              example: 'Sathorn Road, Bangkok',
            },
            tel: {
              type: 'string',
              description: 'เบอร์โทรศัพท์ (optional)',
              example: '02-123-4567',
            },
            open_time: {
              type: 'string',
              description: 'เวลาเปิด (รูปแบบ HH:mm)',
              pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$',
              example: '09:00',
            },
            close_time: {
              type: 'string',
              description: 'เวลาปิด (รูปแบบ HH:mm)',
              pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$',
              example: '18:00',
            },
            price: {
              type: 'number',
              description: 'ราคาต่อชั่วโมง',
              example: 150,
            },
            desc: {
              type: 'string',
              description: 'รายละเอียดเพิ่มเติม',
              example: 'Modern space with fast Wi-Fi and coffee.',
            },
          },
        },
        Rating: {
          type: 'object',
          required: ['coWorkingSpace', 'user'],
          properties: {
            coWorkingSpace: {
              type: 'string',
              description: 'ObjectId ของ CoWorkingSpace ที่ถูกให้คะแนน',
              example: '662f1e6e9d88c6c8dcd9e5a3',
            },
            user: {
              type: 'string',
              description: 'ObjectId ของ User ที่ให้คะแนน',
              example: '662f1e6e9d88c6c8dcd9e5a4',
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              description: 'คะแนน (1-5 ดาว)',
              example: 5,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่ให้คะแนน (สร้างอัตโนมัติ)',
              example: '2025-04-29T05:00:00.000Z',
            },
          },
        },
        Reservation: {
          type: 'object',
          required: ['reserveDate', 'user', 'coWorkingSpace', 'cancellationDeadline'],
          properties: {
            reserveDate: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่ต้องการจอง',
              example: '2025-05-01T09:00:00.000Z',
            },
            user: {
              type: 'string',
              description: 'ObjectId ของผู้ใช้งานที่จอง (ref: User)',
              example: '662f1e6e9d88c6c8dcd9e5b0',
            },
            coWorkingSpace: {
              type: 'string',
              description: 'ObjectId ของ CoWorkingSpace ที่ทำการจอง (ref: CoWorkingSpace)',
              example: '662f1e6e9d88c6c8dcd9e5a9',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่สร้างรายการจอง (Backend สร้างให้อัตโนมัติ)',
              example: '2025-04-29T05:00:00.000Z',
            },
            cancellationDeadline: {
              type: 'string',
              format: 'date-time',
              description: 'วันหมดเขตที่สามารถยกเลิกการจองได้ (24 ชั่วโมงหลัง reserveDate)',
              example: '2025-05-02T09:00:00.000Z',
            },
          },
        },
        Review: {
          type: 'object',
          required: ['user', 'coWorkingSpaceId', 'comment'],
          properties: {
            user: {
              type: 'string',
              description: 'ObjectId ของ User ที่เขียนรีวิว',
              example: '662f1e6e9d88c6c8dcd9e5c1',
            },
            coWorkingSpaceId: {
              type: 'string',
              description: 'ObjectId ของ CoWorkingSpace ที่รีวิว',
              example: '662f1e6e9d88c6c8dcd9e5a7',
            },
            comment: {
              type: 'string',
              description: 'ข้อความรีวิว',
              maxLength: 500,
              example: 'สถานที่สะอาด บรรยากาศดีมาก แนะนำเลยครับ!',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่สร้างรีวิว (สร้างอัตโนมัติ)',
              example: '2025-04-29T07:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่อัปเดตรีวิวล่าสุด (สร้างอัตโนมัติ)',
              example: '2025-04-29T07:30:00.000Z',
            },
          },
        },
        TopUpHistory: {
          type: 'object',
          required: ['userId', 'amount', 'chargeId', 'status'],
          properties: {
            userId: {
              type: 'string',
              description: 'ID ของผู้ใช้งานที่เติมเงิน',
              example: '662f1e6e9d88c6c8dcd9e5b0',
            },
            amount: {
              type: 'number',
              description: 'จำนวนเงินที่เติม (บาท)',
              example: 500,
            },
            chargeId: {
              type: 'string',
              description: 'รหัสรายการชำระเงิน (ต้องไม่ซ้ำ)',
              example: 'chrg_test_4xs9408a642a1m8a8z3',
            },
            status: {
              type: 'string',
              description: 'สถานะของรายการ (เช่น pending, successful, failed)',
              example: 'successful',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่สร้างรายการเติมเงิน',
              example: '2025-04-29T08:00:00.000Z',
            },
          },
        },
        Transaction: {
          type: 'object',
          required: ['user', 'amount', 'type'],
          properties: {
            user: {
              type: 'string',
              description: 'ObjectId ของ User ที่ทำธุรกรรม',
              example: '662f1e6e9d88c6c8dcd9e5c1',
            },
            amount: {
              type: 'number',
              description: 'จำนวนเงินในธุรกรรม (ไม่ติดลบ)',
              minimum: 0,
              example: 300,
            },
            type: {
              type: 'string',
              description: 'ประเภทของธุรกรรม',
              enum: ['topup', 'reserve', 'refund'],
              example: 'topup',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่สร้างธุรกรรม (สร้างอัตโนมัติ)',
              example: '2025-04-29T08:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'วันที่อัปเดตธุรกรรมล่าสุด (สร้างอัตโนมัติ)',
              example: '2025-04-29T09:00:00.000Z',
            },
          },
        }
        

      },
      
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
