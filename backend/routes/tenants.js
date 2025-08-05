const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')

const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');

const paymentController = require('../controllers/paymentController');
const tenantsController = require('../controllers/tenantsController')

const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, tenantsController.getTenants);
router.post('/', authenticateToken, tenantsController.createTenant);
router.put('/:id', authenticateToken, tenantsController.updateTenant);
router.delete('/:id',authenticateToken, tenantsController.deleteTenant);

router.post('/payments', paymentController.createPayment);
router.get('/payments/:tenantId', paymentController.getPaymentById);

module.exports = router;
