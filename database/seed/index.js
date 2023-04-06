const fs = require('fs');
const csv = require('csv-parser');
const { Users, Jokes, Categories, Comments } = require('../associations');
const { User, Category, Joke, Comment } = require('../entities/index');

const seeds = [
  {
    name: 'categories',
    model: Categories,
    data: './database/seed/data/categories.csv',
    dataModel: (row) => new Category(row),
  },
  {
    name: 'users',
    model: Users,
    data: './database/seed/data/users.csv',
    dataModel: (row) => new User(row),
  },
  {
    name: 'jokes',
    model: Jokes,
    data: './database/seed/data/jokes.csv',
    dataModel: (row) => new Joke(row),
  },
  {
    name: 'comments',
    model: Comments,
    data: './database/seed/data/comments.csv',
    dataModel: (row) => new Comment(row),
  }
]

async function seedModel(seed){
  fs.createReadStream(seed.data)
    .pipe(csv())
    .on('data', (row) => {
      seed.model.create(seed.dataModel(row));
    })
    .on('end', () => {
      console.log(`${seed.name} file successfully processed`);
    });
}

async function seedDatabase() {
  for (const seed of seeds) {
    await seedModel(seed);
  }
}

module.exports = seedDatabase;