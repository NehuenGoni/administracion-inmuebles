const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const { sendPaymentReceipt } = require('../services/emailService');
const moment = require('moment');

const createPayment = async (req, res) => {
  const { tenantId, amount, description, date } = req.body;
  const userId = req.user.id;

  if (!tenantId || amount === undefined || !date) {
    return res.status(400).json({ message: 'tenantId, amount y date son obligatorios' });
  }

  const parsedDate = moment(date, 'DD-MM-YYYY', true);
  if (!parsedDate.isValid()) {
    return res.status(400).json({ message: 'Formato de fecha inválido. Debe ser DD-MM-YYYY' });
  }

  try {
    const newPayment = new Payment({
      tenantId,
      amount,
      date: parsedDate.toDate(),
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
  const userId = req.user.id;

  try {
    const payments = await Payment.find({ user: userId }).populate('tenantId');
    const formattedPayments = payments.map(payment => ({
      ...payment.toObject(),
      date: moment(payment.date).format('DD-MM-YYYY'),
    }));
    res.status(200).json(formattedPayments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos' });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sin autorización para esta acción.' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el pago' });
  }
};

const updatePayment = async (req, res) => {
  const { amount, description, date } = req.body;
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sin autorización para esta acción.' });
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
    res.status(400).json({ message: 'Error al actualizar el pago' });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    if (payment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Sin autorización para esta acción.' });
    }

    await Payment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pago eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el pago' });
  }
};

const getPaymentsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const userId = req.user.id;
    const payments = await Payment.find({ tenantId, user: userId });
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron pagos para este inquilino' });
    }
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los pagos' });
  }
};

const sendReceiptEmail = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const userId = req.user.id;

    // Buscar el pago
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    // Verificar autorización
    if (payment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Sin autorización para esta acción.' });
    }

    // Buscar el inquilino
    const tenant = await Tenant.findById(payment.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Inquilino no encontrado' });
    }

    // Validar que el inquilino tenga email
    if (!tenant.email) {
      return res.status(400).json({ message: 'El inquilino no tiene un email registrado' });
    }

    // Enviar el email con el recibo
    await sendPaymentReceipt(tenant.email, tenant.name, payment);

    res.json({ 
      message: 'Comprobante enviado exitosamente al inquilino',
      email: tenant.email,
      receiptNumber: payment.receiptNumber
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al enviar el comprobante: ' + error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByTenant,
  sendReceiptEmail
};
