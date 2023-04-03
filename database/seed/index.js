const fs = require('fs');
const csv = require('csv-parser');
const { Users, Jokes, Categories } = require('../associations');
const { User, Category, Joke } = require('../entities/index');

const seeds = [
  {
    model: Categories,
    data: './database/seed/data/categories.csv',
    dataModel: (row) => new Category(row),
  },
  {
    model: Users,
    data: './database/seed/data/users.csv',
    dataModel: (row) => new User(row),
  },
  {
    model: Jokes,
    data: './database/seed/data/jokes.csv',
    dataModel: (row) => new Joke(row),
  },
]

async function seedData(seed){
  fs.createReadStream(seed.data)
    .pipe(csv())
    .on('data', (row) => {
      seed.model.create(seed.dataModel(row));
    })
    .on('end', () => {
      console.log(`${seed.model} file successfully processed`);
    });
}

async function seed() {
  for (const seed of seeds) {
    await seedData(seed);
  }
}

module.exports = seed;