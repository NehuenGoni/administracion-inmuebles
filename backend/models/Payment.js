const mongoose = require('mongoose');


const paymentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: '', 
  },
  receiptNumber: { 
    type: String, 
    unique: true, 
    required: false 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

paymentSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const lastPayment = await this.constructor.findOne().sort({ receiptNumber: -1 });

      const lastReceiptNumber = lastPayment?.receiptNumber?.split('-')[1] || '0000';
      const newNumber = String(parseInt(lastReceiptNumber, 10) + 1).padStart(3, '0');

      this.receiptNumber = `R-${newNumber}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;