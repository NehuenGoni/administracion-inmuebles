const Payment = require('../models/Payment');
const moment = require('moment')

const createPayment = async (req, res) => {
  const { tenantId, amount, description } = req.body;

  try {
    const newPayment = new Payment({
      tenantId,
      amount,
      description,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  const getPayments = async (req, res) => {
    try {
      const payments = await Payment.find().populate('tenantId'); 
      const formattedPayments = payments.map(payment => ({
        ...payment.toObject(),
        date: moment(payment.date).format('DD-MM-YYYY'), 
      }));
      res.status(200).json(formattedPayments);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los pagos', error });
    }
  };

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayment = async (req, res) => {
  const { amount, description } = req.body;
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (amount !== undefined) payment.amount = amount;
    if (description !== undefined) payment.description = description;

    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};