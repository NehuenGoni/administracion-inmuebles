const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Ruta para obtener todos los inquilinos
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear un nuevo inquilino
router.post('/', async (req, res) => {
  const tenant = new Tenant({
    name: req.body.name,
    department: req.body.department,
    status: req.body.status || 'Al día',
  });
  try {
    const newTenant = await tenant.save();
    res.status(201).json(newTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para actualizar un inquilino
router.put('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tenant) return res.status(404).json({ message: 'Inquilino no encontrado' });
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para eliminar un inquilino
router.delete('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Inquilino no encontrado' });
    res.json({ message: 'Inquilino eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear un pago
router.post('/payments', paymentController.createPayment);

// Ruta para obtener pagos de un inquilino específico
router.get('/payments/:tenantId', paymentController.getPaymentById);

module.exports = router;
