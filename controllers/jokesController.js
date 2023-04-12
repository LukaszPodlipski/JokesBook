const sequelize = require('../database/index');
const Jokes = require('../database/models/jokes')
const { Joke } = require('../database/entities/index')

const getAllJokes = async (req, res) => {
  try {
    const jokes = await Jokes.findAll();
    res.status(200).json(jokes);
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

const addJoke = async (req, res) => {
  try {
    const userId = req.user.id
    const newJoke = new Joke({ ...req.body, userId});
    await Jokes.create(newJoke);
    res.status(201).json({ message: 'Joke added succesfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllJokes, getRandomJoke, getSpecificJoke, addJoke };
