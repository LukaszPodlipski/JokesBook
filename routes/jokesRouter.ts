import express from 'express';
import { authenticateToken } from '../controllers/authMiddleware';

const router = express.Router();

import {
  getAllJokes,
  getRandomJoke,
  getSpecificJoke,
  addJoke,
  deleteSpecificJoke,
  updateSpecificJoke,
  rateJoke,
  commentJoke,
  translateJoke,
} from '../controllers/jokesController';

router.get('/', getAllJokes);

router.get('/random', getRandomJoke);

router.get('/specific/:id', getSpecificJoke);

router.post('/add', authenticateToken, addJoke);

router.delete('/specific/:id', authenticateToken, deleteSpecificJoke);

router.patch('/specific/:id', authenticateToken, updateSpecificJoke);

router.post('/rate/:id', authenticateToken, rateJoke);

router.post('/comment/:id', authenticateToken, commentJoke);

router.get('/translate/:id', authenticateToken, translateJoke);

export default router;
