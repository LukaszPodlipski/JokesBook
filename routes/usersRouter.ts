import express from 'express';
import { authenticateToken } from '../controllers/authMiddleware';
import { getUser } from '../controllers/usersController';

const router = express.Router();

router.get('/me', authenticateToken, getUser);

export default router;
