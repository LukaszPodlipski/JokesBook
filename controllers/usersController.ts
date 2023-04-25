import { Response } from 'express';
import { IAuthenticatedRequest } from 'database/entities';
import { errorHandler } from './utils';

import { Users } from '../database/models/users';

export const getUser = async (req: IAuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await Users.findOne({ where: { id: userId } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
