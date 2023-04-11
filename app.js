const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database/index');
const { seedDatabase, dropDatabase } = require('./database/seed/index');

const authRouter = require('./routes/authRouter');
const jokesRouter = require('./routes/jokesRouter');

const app = express();

// App configuration
app.use(bodyParser.json()); // For parsing JSON data
app.use(bodyParser.urlencoded({ extended: true }));// For parsing URL-encoded data

// Routes
app.use('/login', authRouter);
app.use('/jokes', jokesRouter);

// Start the server
app.listen(3000, async () => {
  console.log('JokesBook app listening on port 3000!');
  await dropDatabase();
  await sequelize.sync();
  await seedDatabase();
});