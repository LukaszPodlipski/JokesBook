import { Comments } from '../../database/models/comments';
import { Users } from '../../database/models/users';
import { Categories } from '../../database/models/categories';
import { Ratings } from '../../database/models/ratings';
import { Jokes } from '../../database/models/jokes';
import { Response } from 'express';
import sequelize from '../../database';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

const hashPassword = (password: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
        return;
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(hash);
      });
    });
  });
};

const verifyPassword = (password: string, hash: string) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

const getJokeComments = async (jokeId: number) => {
  return await Promise.all(
    await Comments.findAll({ where: { jokeId } }).then((comments) =>
      comments.map(async (comment) => {
        const author = await Users.findOne({
          where: { id: comment.userId },
        });
        return {
          id: comment.id,
          content: comment.content,
          authorName: author.name,
          authorId: author.id,
          createdAt: comment.createdAt,
        };
      })
    )
  );
};

const getJokeCategory = async (categoryId: number) => {
  return await Categories.findOne({ where: { id: categoryId } }).then((category) => ({ id: categoryId, name: category.name }));
};

const getJokeRate = async (jokeId: number) => {
  const ratings = (await Ratings.findAll({ where: { jokeId } })) || [];
  const rate = ratings.map((obj) => Number(obj?.rate))?.reduce((acc, curr) => acc + curr, 0) / ratings?.length || 0;
  return rate;
};

const getJokeUser = async (userId: number) => {
  return await Users.findOne({ where: { id: userId } }).then((user) => user.name);
};

const getCompleteJoke = async (jokeId: number, categoryId: number, userId: number, content: string) => {
  const rate = await getJokeRate(jokeId);
  const comments = await getJokeComments(jokeId);
  const category = await getJokeCategory(categoryId);
  const user = await getJokeUser(userId);
  return {
    id: jokeId,
    category,
    user,
    content,
    rate,
    comments,
  };
};

const getRandomJokeUtil = async () => {
  return await Jokes.findOne({
    order: [[sequelize.fn('RANDOM')]],
  } as unknown);
};

const errorHandler = (err: Error, res: Response) => {
  const isTest = process.env.NODE_ENV === 'test';
  if (!isTest) console.log(err);

  if (err?.name === 'ValidationError') {
    res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
  }
};

export {
  getCompleteJoke,
  getRandomJokeUtil,
  getJokeComments,
  getJokeCategory,
  getJokeRate,
  getJokeUser,
  errorHandler,
  hashPassword,
  verifyPassword,
};
