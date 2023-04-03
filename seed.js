const fs = require('fs');
const csv = require('csv-parser');
const User = require('./models/user');

async function seedUsers() {
  fs.createReadStream('./seedData/users.csv')
    .pipe(csv())
    .on('data', (row) => {
      // Create a new user object with the data from the CSV row
      const newUser = {
        id: row.id,
        email: row.email,
        password: row.password,
      };
      // Insert the new user into the database
      User.create(newUser);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
}

async function seed() {
  await seedUsers();
}

module.exports = seed;