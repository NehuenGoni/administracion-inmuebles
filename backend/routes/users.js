const express = require('express');
const router = express.Router();
const { register, login, getUserData, forgotPassword, resetPassword } = require('../controllers/usersController');
const authenticateToken = require('../middlewares/authenticateToken')

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', authenticateToken, getUserData);

module.exports = router;