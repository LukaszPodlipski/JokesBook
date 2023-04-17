import { Users } from './models/users';
import { Jokes } from './models/jokes';
import { Categories } from './models/categories';
import { Comments } from './models/comments';
import { Ratings } from './models/ratings';

Jokes.belongsTo(Users, { foreignKey: 'userId' });
Users.hasMany(Jokes);
Jokes.belongsTo(Categories, { foreignKey: 'categoryId' });
Jokes.hasMany(Comments, { foreignKey: 'jokeId' });
Jokes.hasMany(Ratings, { foreignKey: 'jokeId' });
Comments.belongsTo(Jokes, { foreignKey: 'jokeId' });

export { Users, Jokes, Categories, Comments, Ratings };
