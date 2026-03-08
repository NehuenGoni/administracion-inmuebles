const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middlewares/authenticateToken')
const { authorizePermission } = require('../middlewares/authorize');

router.post('/', authenticateToken, authorizePermission('payments:write'), paymentController.createPayment);

router.get('/', authenticateToken, authorizePermission('payments:read'), paymentController.getPayments);

router.get('/:id', authenticateToken, authorizePermission('payments:read'), paymentController.getPaymentById);

router.put('/:id', authenticateToken, authorizePermission('payments:write'), paymentController.updatePayment);

router.delete('/:id', authenticateToken, authorizePermission('payments:write'), paymentController.deletePayment);

router.get('/tenant/:tenantId', authenticateToken, authorizePermission('payments:read'), paymentController.getPaymentsByTenant);

module.exports = router;