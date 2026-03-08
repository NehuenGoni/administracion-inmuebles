const express = require('express');
const router = express.Router();
const { register, login, getUserData } = require('../controllers/usersController');
const authenticateToken = require('../middlewares/authenticateToken')

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticateToken, getUserData);

module.exports = router;