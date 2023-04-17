import express, { Application } from 'express';
import bodyParser from 'body-parser';
import sequelize from './database';

import { seedDatabase, dropDatabase } from './database/seed';

import authRouter from './routes/authRouter';
import jokesRouter from './routes/jokesRouter';
import usersRouter from './routes/usersRouter';

const app: Application = express();

// App configuration
app.use(bodyParser.json()); // For parsing JSON data
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded data

// Routes
app.use('/login', authRouter);
app.use('/jokes', jokesRouter);
app.use('/users', usersRouter);

// Start the server
app.listen(3000, async () => {
  console.log('JokesBook app listening on port 3000!');
  await dropDatabase();
  await sequelize.sync();
  await seedDatabase();
});
