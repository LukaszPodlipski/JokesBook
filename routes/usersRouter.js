const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/authMiddleware');
const { getUser } = require('../controllers/usersController');


router.get('/me', authenticateToken, getUser);

module.exports = router;