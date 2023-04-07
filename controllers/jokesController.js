const Jokes = require('../database/models/jokes')

const getAllJokes = async (req, res) => {
  try {
    const jokes = await Jokes.findAll();
    res.status(200).json(jokes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getAllJokes };
