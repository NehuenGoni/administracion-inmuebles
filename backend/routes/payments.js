const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/authenticateToken')

router.post('/', authenticateToken, paymentController.createPayment);

router.get('/', authenticateToken, paymentController.getPayments);

router.get('/:id', authenticateToken, paymentController.getPaymentById);

router.put('/:id', authenticateToken, paymentController.updatePayment);

router.delete('/:id', authenticateToken, paymentController.deletePayment);

router.get('/tenant/:tenantId', authenticateToken, paymentController.getPaymentsByTenant);

module.exports = router;