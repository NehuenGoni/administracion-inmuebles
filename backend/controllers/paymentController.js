const Payment = require('../models/Payment');
const moment = require('moment')

const createPayment = async (req, res) => {
  const { tenantId, amount, description, date } = req.body;

  const userId = req.user.id

  try {
    const newPayment = new Payment({
      tenantId,
      amount,
      date: moment(date, 'DD-MM-YYY').toDate(),
      description,
      user: userId,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPayments = async (req, res) => {
  const userId = req.user.id

  try {
    const payments = await Payment.find({user: userId}).populate('tenantId'); 
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
  const { amount, description, date } = req.body;
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (amount !== undefined) payment.amount = amount;
    if (description !== undefined) payment.description = description;
    
    if (date !== undefined) {
      const parsedDate = moment(date, 'DD-MM-YYYY', true);
      if (!parsedDate.isValid()) {
        return res.status(400).json({ message: 'Formato de fecha inválido. Debe ser DD-MM-YYYY' });
      }
      payment.date = parsedDate.toDate();
    }

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

const getPaymentsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const payments = await Payment.find({ tenantId });
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pagos para este inquilino' });
    }
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByTenant
};