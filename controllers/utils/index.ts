import { Comments } from '../../database/models/comments';
import { Users } from '../../database/models/users';
import { Categories } from '../../database/models/categories';
import { Ratings } from '../../database/models/ratings';
import { Response } from 'express';

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

const errorHandler = (err: Error, res: Response) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { getCompleteJoke, getJokeComments, getJokeCategory, getJokeRate, getJokeUser, errorHandler };
