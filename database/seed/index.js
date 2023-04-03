const fs = require('fs');
const csv = require('csv-parser');
const { Users, Jokes } = require('../associations');

async function seedUsers() {
  fs.createReadStream('./database/seed/data/users.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Create a new user object with the data from the CSV row
      const newUser = {
        id: row.id,
        email: row.email,
        password: row.password,
        name: row.name,
      };
      // Insert the new user into the database
      Users.create(newUser);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

async function seedJokes() {
  fs.createReadStream('./database/seed/data/jokes.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Create a new user object with the data from the CSV row
      const newJoke = {
        id: row.id,
        userId: row.userId,
        content: row.content,
        ratings: row?.ratings || [],
      };
      // Insert the new user into the database
      Jokes.create(newJoke);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

async function seed() {
  await Promise.all([
    seedUsers(),
    seedJokes(),
  ]);
}

module.exports = seed;