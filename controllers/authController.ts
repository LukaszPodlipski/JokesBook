import jwt from 'jsonwebtoken';
import { Users } from '../database/models/users';
import { Response } from 'express';
import { verifyPassword, errorHandler } from './utils';
import { IUnAuthenticatedRequest, IUser, ILoginPayload } from 'database/entities';
import { loginSchema } from './validatorsSchemas';
import { StatusCodes } from 'http-status-codes';

const secretKey = process.env.SECRET_KEY;

export const getValidatedUser = async (payload: ILoginPayload): Promise<IUser> => {
  await loginSchema.validate(payload);
  const { email, password } = payload;

  const user = await Users.findOne({ where: { email } });
  if (!user) return null;

  const validPassword = await verifyPassword(password, user.password);
  if (!validPassword) return null;

  return user;
};

export const login = async (req: IUnAuthenticatedRequest<{ email: string; password: string }>, res: Response) => {
  try {
    const user: IUser = await getValidatedUser(req.body);

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    // Return token as response
    res.json({ token });
  } catch (err) {
    errorHandler(err, res);
  }
};
