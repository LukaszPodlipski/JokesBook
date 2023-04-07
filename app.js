const express = require('express');
const sequelize = require('./database/index');
const { seedDatabase, dropDatabase } = require('./database/seed/index');

const jokesRouter = require('./routes/jokesRouter');

const app = express();



app.listen(3000, async () => {
  console.log('Example app listening on port 3000!');
  await dropDatabase();
  await sequelize.sync();
  await seedDatabase();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/jokes', jokesRouter);