const Users = require('./models/users');
const Jokes = require('./models/jokes');
const Categories = require('./models/categories');

Jokes.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(Jokes);
Jokes.belongsTo(Categories, { foreignKey: 'categoryId' });

module.exports = { Users, Jokes, Categories };
