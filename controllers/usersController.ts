import { Response } from 'express';
import { IAuthenticatedRequest } from 'database/entities';
import { errorHandler } from './utils';
import { StatusCodes } from 'http-status-codes';

import { Users } from '../database/models/users';

import { UserResponse } from '../database/entities/index';

export const getUser = async (req: IAuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await Users.findOne({ where: { id: userId } });
    if (user) {
      res.json(new UserResponse(user));
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
