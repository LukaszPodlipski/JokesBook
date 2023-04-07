const express = require('express');
const router = express.Router();
const jokesController = require('../controllers/jokesController');

router.get('/', jokesController.getAllJokes);

module.exports = router;