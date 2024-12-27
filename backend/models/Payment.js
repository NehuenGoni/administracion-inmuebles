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
});

paymentSchema.pre('save', async function (next) {
  if (!this.receiptNumber) {
    const Payment = mongoose.model('Payment', paymentSchema);
    const lastPayment = await Payment.findOne().sort({ receiptNumber: -1 });

    const lastNumber = lastPayment
      ? parseInt(lastPayment.receiptNumber.split('-')[1], 10)
      : 0;

    this.receiptNumber = `R-${lastNumber + 1}`;
  }
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;