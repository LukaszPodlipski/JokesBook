const express = require('express');
const sequelize = require('./database/index');
const { seedDatabase, dropDatabase } = require('./database/seed/index');

// const User = require('./models/user'); // przykładowy import modelu usera

const app = express();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, async () => {
  console.log('Example app listening on port 3000!');
  await dropDatabase();
  await sequelize.sync();
  await seedDatabase();
});