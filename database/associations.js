const Users = require('./models/users');
const Jokes = require('./models/jokes');
const Categories = require('./models/categories');
const Comments = require('./models/comments');
const Ratings = require('./models/ratings');

Jokes.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(Jokes);
Jokes.belongsTo(Categories, { foreignKey: 'categoryId' });
Jokes.hasMany(Comments, { foreignKey: 'jokeId' });
Jokes.hasMany(Ratings, { foreignKey: 'jokeId' });
Comments.belongsTo(Jokes, { foreignKey: 'jokeId' });

module.exports = { Users, Jokes, Categories, Comments, Ratings };
