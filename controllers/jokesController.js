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
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getRandomJoke = async (req, res) => {
  try {
    const joke = await Jokes.findOne({ order: [[sequelize.fn('RANDOM')]]});
    res.status(200).json(joke);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSpecificJoke = async (req, res) => {
  try {
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });
    if (joke) {
      res.status(200).json(joke);
    } else {
      res.status(404).json({ error: 'Joke not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSpecificJoke = async (req, res) => {
  try {
    const { user } = req
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });

    if (!joke){
      res.status(404).json({ error: 'Joke not found' });
    } else if (joke?.userId !== user?.id) {
      res.status(403).json({ error: "User doesn't have permission to delete this joke" });
    } else {
      await Jokes.destroy({ where: { id } });
      res.status(200).json({ message: 'Joke deleted succesfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSpecificJoke = async (req, res) => {
  try {
    const { user } = req
    const { id } = req.params;
    const joke = await Jokes.findOne({ where: { id } });
    const data = req.body

    if (!data.content && !data.categoryId) {
      res.status(400).json({ error: 'No content or category to update' });
    } else if (!joke) {
      res.status(404).json({ error: 'Joke not found' });
    } else if (joke?.userId !== user?.id){
      res.status(403).json({ error: "User doesn't have permission to update this joke" });
    } else {
      await Jokes.update({ ...req.body }, { where: { id } });
      res.status(200).json({ message: 'Joke updated succesfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addJoke = async (req, res) => {
  try {
    const { id } = req.user
    const newJoke = new Joke({ ...req.body, userId: id });
    await Jokes.create(newJoke);
    res.status(201).json({ message: 'Joke added succesfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rateJoke = async (req, res) => {
  const { user } = req
  const { id } = req.params;
  const { rate } = req.body.rate;
  try {
    const joke = await Jokes.findOne({ where: { id } });

    if (!joke){
      res.status(404).json({ error: `Joke with id ${id} not found` });
    } else if (user?.id === joke?.userId) {
      res.status(403).json({ error: "You can't rate your own joke" });
    } else {
      const ratings = joke.ratings || [];
      ratings.push(rate);

      await Jokes.update({ ratings }, { where: { id } });
      res.status(201).json({ message: 'Rating added succesfully' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getAllJokes, getRandomJoke, getSpecificJoke, updateSpecificJoke, deleteSpecificJoke, addJoke, rateJoke };
