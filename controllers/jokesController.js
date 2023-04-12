const sequelize = require('../database/index');
const Jokes = require('../database/models/jokes')
const Users = require('../database/models/users')
const Categories = require('../database/models/categories')
const { Joke } = require('../database/entities/index')

const getAllJokes = async (req, res) => {
  try {
    const jokes = await Jokes.findAll();

    const transformedJokes = await Promise.all(jokes.map( async joke =>  {
      const { id, content, categoryId, ratings } = joke;
      const rate = ratings?.reduce((acc, curr) => acc + curr, 0) / ratings?.length || 0;
      const user = await Users.findOne({ where: { id: joke.userId } });
      const category = await Categories.findOne({ where: { id: joke.categoryId } });
      return { id, user: user.name, category: { id: categoryId, name: category.name }, content, rate };
    }));

    res.status(200).json(transformedJokes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getRandomJoke = async (req, res) => {
  try {
    const joke = await Jokes.findOne({
      order: [
        [sequelize.fn('RANDOM')]
      ]
    });
    res.status(200).json(joke);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getSpecificJoke = async (req, res) => {
  try {
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });
    if (joke) {
      res.status(200).json(joke);
    } else {
      res.status(404).json({ message: 'Joke not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteSpecificJoke = async (req, res) => {
  try {
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });
    if (joke) {
      await Jokes.destroy({ where: { id } });
      res.status(200).json({ message: 'Joke deleted succesfully' });
    } else {
      res.status(404).json({ message: 'Joke not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateSpecificJoke = async (req, res) => {
  try {
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });
    const data = req.body

    if (!data.content && !data.categoryId) {
      res.status(400).json({ message: 'You should provide joke content or category' });
    } else if (joke) {
      await Jokes.update({ ...req.body }, { where: { id } });
      res.status(200).json({ message: 'Joke updated succesfully' });
    } else {
      res.status(404).json({ message: 'Joke not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addJoke = async (req, res) => {
  try {
    const userId = req.user.id
    const newJoke = new Joke({ ...req.body, userId });
    await Jokes.create(newJoke);
    res.status(201).json({ message: 'Joke added succesfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const rateJoke = async (req, res) => {
  const jokeId = req.params.id;
  const rating = req.body.rate;
  try {
    const joke = await Jokes.findOne({ where: { id: jokeId } });
    if (!joke) throw new Error(`Joke with id ${jokeId} not found`);

    const ratings = joke.ratings || [];
    ratings.push(rating);

    await Jokes.update({ ratings }, { where: { id: jokeId } });

    res.status(201).json({ message: 'Rating added succesfully' });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add rating');
  }
}

module.exports = { getAllJokes, getRandomJoke, getSpecificJoke, updateSpecificJoke, deleteSpecificJoke, addJoke, rateJoke };
