const Users = require('../database/models/users');

const getUser = async (req, res) => {
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

module.exports = { getUser };