import { getCompleteJoke } from './utils';
import sequelize from '../database';
import { Joke, Rating, Comment } from '../database/entities/index';
import { Jokes } from '../database/models/jokes';
import { Comments } from '../database/models/comments';
import { Ratings } from '../database/models/ratings';

export const getAllJokes = async (req, res) => {
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRandomJoke = async (req, res) => {
  try {
    const { id, categoryId, userId, content } = await Jokes.findOne({
      order: [[sequelize.fn('RANDOM')]],
    } as unknown);
    const joke = await getCompleteJoke(id, categoryId, userId, content);
    res.status(200).json(joke);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSpecificJoke = async (req, res) => {
  try {
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSpecificJoke = async (req, res) => {
  try {
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSpecificJoke = async (req, res) => {
  try {
    const { user } = req;
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });
    const data = req.body;

    if (!data.content && !data.categoryId) {
      res.status(400).json({ error: 'No content or category to update' });
    } else if (!joke) {
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addJoke = async (req, res) => {
  try {
    const { id } = req.user;
    const newJoke = new Joke({ ...req.body, userId: id });
    await Jokes.create(newJoke);
    res.status(201).json({ message: 'Joke added succesfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const rateJoke = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { rate } = req.body;
  try {
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const commentJoke = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { comment } = req.body;
  try {
    if (!comment) {
      res.status(400).json({ error: 'No comment to add' });
    } else {
      const newComment = new Comment({
        content: comment,
        userId: user.id,
        jokeId: id,
      });
      await Comments.create(newComment);
      res.status(201).json({ message: 'Comment added succesfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
