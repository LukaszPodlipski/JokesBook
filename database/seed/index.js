const fs = require('fs');
const csv = require('csv-parser');
const { Users, Jokes, Categories } = require('../associations');

async function seedUsers() {
  fs.createReadStream('./database/seed/data/users.csv')
    .pipe(csv())
    .on('data', (row) => {
      const newUser = {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
      };
      Users.create(newUser);
    })
    .on('end', () => {
      console.log('Users file successfully processed');
    });
}

async function seedJokes() {
  fs.createReadStream('./database/seed/data/jokes.csv')
    .pipe(csv())
    .on('data', (row) => {
      const newJoke = {
        id: row.id,
        userId: row.userId,
        content: row.content,
        ratings: row?.ratings || [],
        categoryId: row?.categoryId|| [],
      };
      Jokes.create(newJoke);
    })
    .on('end', () => {
      console.log('Jokes file successfully processed');
    });
}

async function seedCategories() {
  fs.createReadStream('./database/seed/data/categories.csv')
    .pipe(csv())
    .on('data', (row) => {
      const newCategory = {
        id: row.id,
        name: row.name,
      };
      Categories.create(newCategory);
    })
    .on('end', () => {
      console.log('Categories file successfully processed');
    });
}

async function seed() {
  await Promise.all([
    seedCategories(),
    seedUsers(),
    seedJokes(),
  ]);
}

module.exports = seed;