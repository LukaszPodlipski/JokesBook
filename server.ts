import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import limit from 'express-rate-limit';
import { CorsOptions } from 'cors';

import bodyParser from 'body-parser';
import sequelize from './database';
import { seedDatabase, dropDatabase } from './database/seed';
import authRouter from './routes/authRouter';
import jokesRouter from './routes/jokesRouter';
import usersRouter from './routes/usersRouter';

export type TServerConfig = {
  port: number;
  corsOptions: CorsOptions;
  limiter: {
    time: number;
    max: number;
  };
};

export const startServer = ({ port, corsOptions, limiter }: TServerConfig) => {
  const app: Application = express();

  // Security
  app.use(helmet());
  app.use(cors(corsOptions));
  app.disable('x-powered-by');
  app.use(limit({ windowMs: limiter.time, max: limiter.max }));

  // App configuration
  app.use(bodyParser.json()); // For parsing JSON data
  app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded data

  // Routes
  app.use('/login', authRouter);
  app.use('/jokes', jokesRouter);
  app.use('/users', usersRouter);

  // Start the server
  app.listen(port, async () => {
    console.log('JokesBook app listening on port 3000!');
    await dropDatabase();
    await sequelize.sync();
    await seedDatabase();
  });
};
