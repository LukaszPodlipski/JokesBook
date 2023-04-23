import jwt from 'jsonwebtoken';
import { Users } from '../database/models/users';
import { Response } from 'express';
import { errorHandler } from './utils';
import { IUnAuthenticatedRequest } from 'database/entities';
import { loginSchema } from './validatorsSchemas';
const secretKey = process.env.SECRET_KEY;

export const login = async (req: IUnAuthenticatedRequest<{ email: string; password: string }>, res: Response) => {
  try {
    await loginSchema.validate(req.body);
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    // Return token as response
    res.json({ token });
  } catch (err) {
    errorHandler(err, res);
  }
};
