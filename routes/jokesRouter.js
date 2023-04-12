const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/authMiddleware');
const { getAllJokes, getRandomJoke, getSpecificJoke, addJoke } = require('../controllers/jokesController');

router.get('/', getAllJokes);

router.get('/random', getRandomJoke);

router.get('/specific/:id', getSpecificJoke);

router.post('/add', authenticateToken, addJoke);

module.exports = router;