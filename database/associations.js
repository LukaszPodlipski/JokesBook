const Users = require('./models/users');
const Jokes = require('./models/jokes');

Jokes.belongsTo(Users, {
  foreignKey: 'userId',
});
Users.hasMany(Jokes);

module.exports = { Users, Jokes };
