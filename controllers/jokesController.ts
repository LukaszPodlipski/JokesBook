import { Request, Response } from 'express';
import { IAuthenticatedRequest, ISpecificJokeParams, IAuthReqTypedBody } from 'database/entities';

import {
  specificJokeParamsSchema,
  rateJokeBodySchema,
  commentJokeBodySchema,
  addJokeBodySchema,
  updateJokeBodySchema,
} from './validatorsSchemas';

import { getCompleteJoke, errorHandler } from './utils';
import sequelize from '../database';
import { Joke, Rating, Comment } from '../database/entities/index';
import { Jokes } from '../database/models/jokes';
import { Comments } from '../database/models/comments';
import { Ratings } from '../database/models/ratings';

export const getAllJokes = async (req: Request, res: Response) => {
  try {
    const jokes = await Jokes.findAll();
    const transformedJokes = await Promise.all(
      jokes.map(async (joke) => {
        const { id, categoryId, userId, content } = joke;
        return await getCompleteJoke(id, categoryId, userId, content);
      })
    );

    res.status(200).json(transformedJokes);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getRandomJoke = async (req: Request, res: Response) => {
  try {
    const { id, categoryId, userId, content } = await Jokes.findOne({
      order: [[sequelize.fn('RANDOM')]],
    } as unknown);
    const joke = await getCompleteJoke(id, categoryId, userId, content);
    res.status(200).json(joke);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const getSpecificJoke = async (req: Request & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);

    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });

    if (joke) {
      const { categoryId, userId, content } = joke;
      const newJoke = await getCompleteJoke(id, categoryId, userId, content);
      res.status(200).json(newJoke);
    } else {
      res.status(404).json({ error: 'Joke not found' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export const deleteSpecificJoke = async (req: IAuthenticatedRequest & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);

    const { user } = req;
    const { id } = req.params;

    const joke = await Jokes.findOne({ where: { id } });

    if (!joke) {
      res.status(404).json({ error: 'Joke not found' });
    } else if (joke?.userId !== user?.id) {
      res.status(403).json({
        error: "User doesn't have permission to delete this joke",
      });
    } else {
      await Jokes.destroy({ where: { id } });
      res.status(200).json({ message: 'Joke deleted succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export const updateSpecificJoke = async (req: IAuthenticatedRequest & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);
    await updateJokeBodySchema.validate(req.body);

    const { user } = req;
    const { id } = req.params;

    const joke = await Jokes.findOne({ where: { id } });

    if (!joke) {
      res.status(404).json({ error: 'Joke not found' });
    } else if (joke?.userId !== user?.id) {
      res.status(403).json({
        error: "User doesn't have permission to update this joke",
      });
    } else {
      await Jokes.update({ ...req.body }, { where: { id } });
      res.status(200).json({ message: 'Joke updated succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export const addJoke = async (req: IAuthReqTypedBody<{ content: string; categoryId: number }>, res: Response) => {
  try {
    await addJokeBodySchema.validate(req.body);

    const { content, categoryId } = req.body;
    const { id } = req.user;

    const newJoke = new Joke({ content, categoryId, userId: id });
    await Jokes.create(newJoke);
    res.status(201).json({ message: 'Joke added succesfully' });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const rateJoke = async (req: IAuthReqTypedBody<{ rate: number }> & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);
    await rateJokeBodySchema.validate(req.body);

    const { id } = req.params;
    const { user } = req;
    const { rate } = req.body;
    const joke = await Jokes.findOne({ where: { id } });

    if (!joke) {
      res.status(404).json({ error: `Joke with id ${id} not found` });
    } else if (user?.id === joke?.userId) {
      res.status(403).json({ error: "You can't rate your own joke" });
    } else {
      const newRating = new Rating({
        rate,
        userId: user.id,
        jokeId: id,
      });
      await Ratings.create(newRating);
      res.status(201).json({ message: 'Rating added succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

export const commentJoke = async (
  req: IAuthReqTypedBody<{ content: string }> & { params: ISpecificJokeParams },
  res: Response
) => {
  try {
    await specificJokeParamsSchema.validate(req.params);
    await commentJokeBodySchema.validate(req.body);

    const { user } = req;
    const id = req.params.id;
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: 'No comment to add' });
    } else {
      const newComment = new Comment({
        content,
        userId: user.id,
        jokeId: id,
      });
      await Comments.create(newComment);
      res.status(201).json({ message: 'Comment added succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
