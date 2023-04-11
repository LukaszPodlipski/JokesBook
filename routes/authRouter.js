const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../controllers/authMiddleware');

// Login route
router.post('/', authController.login);

// Protected route example
router.get('/protected', authMiddleware.authenticateToken, (req, res) => {
  // Access user data from authenticated request
  const user = req.user;

  // Return protected data
  res.json({ message: `Hello, ${user.email}! This is a protected route.` });
});

module.exports = router;