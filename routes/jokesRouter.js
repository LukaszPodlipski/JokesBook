const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../controllers/authMiddleware');
const { getAllJokes, getRandomJoke, getSpecificJoke, updateSpecificJoke, deleteSpecificJoke, addJoke, rateJoke, commentJoke } = require('../controllers/jokesController');

router.get('/', getAllJokes);

router.get('/random', getRandomJoke);

router.get('/specific/:id', getSpecificJoke);

router.post('/add', authenticateToken, addJoke);

router.delete('/specific/:id', authenticateToken, deleteSpecificJoke);

router.patch('/specific/:id', authenticateToken, updateSpecificJoke);

router.post('/rate/:id', authenticateToken, rateJoke);

router.post('/comment/:id', authenticateToken, commentJoke)

module.exports = router;