const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const { authorizeRole } = require('../middlewares/authorize');
const {
  getAllUsers,
  updateUserRole,
  updateUserPermissions,
  deleteUser,
  getValidPermissions,
} = require('../controllers/adminController');

// All admin routes require superadmin role
router.use(authenticateToken, authorizeRole('superadmin'));

router.get('/users', getAllUsers);
router.get('/permissions', getValidPermissions);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/permissions', updateUserPermissions);
router.delete('/users/:id', deleteUser);

module.exports = router;
