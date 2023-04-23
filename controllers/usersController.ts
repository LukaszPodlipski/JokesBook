import { Response } from 'express';
import { AuthenticatedRequest } from 'database/entities';

import { Users } from '../database/models/users';

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const user = await Users.findOne({ where: { id: userId } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
