import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { IUser, IAuthenticatedRequest } from 'database/entities';

const secretKey = process.env.SECRET_KEY;

export const authenticateToken = (req: IAuthenticatedRequest, res: Response, next: NextFunction) => {
  const token: string | undefined = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err: jwt.VerifyErrors | null, user: IUser) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};
