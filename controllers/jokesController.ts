import { Request, Response } from 'express';
import { IAuthenticatedRequest, ISpecificJokeParams, IAuthReqTypedBody } from 'database/entities';
import { StatusCodes } from 'http-status-codes';

import {
  specificJokeParamsSchema,
  rateJokeBodySchema,
  commentJokeBodySchema,
  addJokeBodySchema,
  updateJokeBodySchema,
} from './validatorsSchemas';

import { getCompleteJoke, getRandomJokeUtil, errorHandler } from './utils';
import { Joke, Rating, Comment, IJoke } from '../database/entities/index';
import { Jokes } from '../database/models/jokes';
import { Comments } from '../database/models/comments';
import { Ratings } from '../database/models/ratings';

/* -------------------------------- GET ALL JOKES --------------------------------- */
export const getAllJokes = async (req: Request, res: Response) => {
  try {
    const jokes = await Jokes.findAll();
    const transformedJokes = await Promise.all(
      jokes.map(async (joke) => {
        const { id, categoryId, userId, content } = joke;
        return await getCompleteJoke(id, categoryId, userId, content);
      })
    );

    res.status(StatusCodes.OK).json(transformedJokes);
  } catch (error) {
    errorHandler(error, res);
  }
};

/* --------------------------------- GET RANDOM JOKE ------------------------------- */
export const getRandomJoke = async (req: Request, res: Response) => {
  try {
    const randomJoke = (await getRandomJokeUtil()) as IJoke;

    if (randomJoke) {
      const { id, categoryId, userId, content } = randomJoke;
      const joke = await getCompleteJoke(id, categoryId, userId, content);
      res.status(StatusCodes.OK).json(joke);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'There are no jokes' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

/* -------------------------------- GET SPECIFIC JOKE ------------------------------- */
export const getSpecificJoke = async (req: Request & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);

    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });

    if (joke) {
      const { categoryId, userId, content } = joke;
      const newJoke = await getCompleteJoke(id, categoryId, userId, content);
      res.status(StatusCodes.OK).json(newJoke);
    } else {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Joke not found' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

/* ------------------------------------- ADD JOKE ------------------------------------ */
export const addJoke = async (req: IAuthReqTypedBody<{ content: string; categoryId: number }>, res: Response) => {
  try {
    await addJokeBodySchema.validate(req.body);

    const { content, categoryId } = req.body;
    const { id } = req.user;

    const newJoke = new Joke({ content, categoryId, userId: id });
    await Jokes.create(newJoke);
    res.status(StatusCodes.CREATED).json({ message: 'Joke added succesfully' });
  } catch (error) {
    errorHandler(error, res);
  }
};

/* -------------------------------- UPDATE SPECIFIC JOKE ------------------------------- */
export const updateSpecificJoke = async (req: IAuthenticatedRequest & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);
    await updateJokeBodySchema.validate(req.body);

    const { user } = req;
    const { id } = req.params;

    const joke = await Jokes.findOne({ where: { id } });

    if (!joke) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Joke not found' });
    } else if (joke?.userId !== user?.id) {
      res.status(StatusCodes.FORBIDDEN).json({
        error: "User doesn't have permission to update this joke",
      });
    } else {
      await Jokes.update({ ...req.body }, { where: { id } });
      res.status(StatusCodes.OK).json({ message: 'Joke updated succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

/* ------------------------------- DELETE SPECIFIC JOKE ------------------------------ */
export const deleteSpecificJoke = async (req: IAuthenticatedRequest & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);

    const { user } = req;
    const { id } = req.params;

    const joke = await Jokes.findOne({ where: { id } });

    if (!joke) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Joke not found' });
    } else if (joke?.userId !== user?.id) {
      res.status(StatusCodes.FORBIDDEN).json({
        error: "User doesn't have permission to delete this joke",
      });
    } else {
      await Jokes.destroy({ where: { id } });
      res.status(StatusCodes.OK).json({ message: 'Joke deleted succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

/* ------------------------------------- RATE JOKE ----------------------------------- */
export const rateJoke = async (req: IAuthReqTypedBody<{ rate: number }> & { params: ISpecificJokeParams }, res: Response) => {
  try {
    await specificJokeParamsSchema.validate(req.params);
    await rateJokeBodySchema.validate(req.body);

    const { id } = req.params;
    const { user } = req;
    const { rate } = req.body;
    const joke = await Jokes.findOne({ where: { id } });

    if (!joke) {
      res.status(StatusCodes.NOT_FOUND).json({ error: `Joke with id ${id} not found` });
    } else if (user?.id === joke?.userId) {
      res.status(StatusCodes.FORBIDDEN).json({ error: "You can't rate your own joke" });
    } else {
      const newRating = new Rating({
        rate,
        userId: user.id,
        jokeId: id,
      });
      await Ratings.create(newRating);
      res.status(StatusCodes.CREATED).json({ message: 'Rating added succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};

/* ----------------------------------- COMMENT JOKE --------------------------------- */
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
    const joke = await Jokes.findOne({ where: { id } });
    if (!joke) {
      res.status(StatusCodes.NOT_FOUND).json({ error: 'Joke not found' });
    } else {
      const newComment = new Comment({
        content,
        userId: user.id,
        jokeId: id,
      });
      await Comments.create(newComment);
      res.status(StatusCodes.CREATED).json({ message: 'Comment added succesfully' });
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
