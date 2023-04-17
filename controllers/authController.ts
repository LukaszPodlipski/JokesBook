import jwt from 'jsonwebtoken';
import { Users } from '../database/models/users';
import { Request, Response } from 'express';

const secretKey = process.env.SECRET_KEY;

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    // Return token as response
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
