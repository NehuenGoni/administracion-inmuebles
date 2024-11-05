const Payment = require('../models/Payment');

// Crear un nuevo pago para un inquilino
const createPayment = async (req, res) => {
  try {
    const { tenantId, amount } = req.body;
    const payment = new Payment({ tenantId, amount });
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el pago', error });
  }
};

// Obtener todos los pagos de un inquilino
const getPaymentsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const payments = await Payment.find({ tenantId });
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener los pagos', error });
  }
};

module.exports = {
  createPayment,
  getPaymentsByTenant,
};
