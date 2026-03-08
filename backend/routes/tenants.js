const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const tenantsController = require('../controllers/tenantsController')

const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, tenantsController.getTenants);
router.post('/', authenticateToken, tenantsController.createTenant);
router.put('/:id', authenticateToken, tenantsController.updateTenant);
router.delete('/:id',authenticateToken, tenantsController.deleteTenant);

router.post('/payments', authenticateToken, paymentController.createPayment);
router.get('/payments/:tenantId', authenticateToken, paymentController.getPaymentById);

module.exports = router;
