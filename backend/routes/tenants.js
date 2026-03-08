const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const tenantsController = require('../controllers/tenantsController')

const authenticateToken = require('../middlewares/authenticateToken');
const { authorizePermission } = require('../middlewares/authorize');

router.get('/', authenticateToken, authorizePermission('tenants:read'), tenantsController.getTenants);
router.post('/', authenticateToken, authorizePermission('tenants:write'), tenantsController.createTenant);
router.put('/:id', authenticateToken, authorizePermission('tenants:write'), tenantsController.updateTenant);
router.delete('/:id', authenticateToken, authorizePermission('tenants:write'), tenantsController.deleteTenant);

router.post('/payments', authenticateToken, authorizePermission('payments:write'), paymentController.createPayment);
router.get('/payments/:tenantId', authenticateToken, authorizePermission('payments:read'), paymentController.getPaymentById);

module.exports = router;
