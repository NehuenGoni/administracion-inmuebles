const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

// validate token
router.get('/validate', authenticateToken, (req, res) => {
  res.status(200).json({ valid: true });
});

module.exports = router;