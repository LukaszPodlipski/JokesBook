import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

// create a new sequelize instance with the local postgres database information.
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? false : true,
});

// test the connection to the database
sequelize
  .authenticate()
  .then(() => {
    console.log('[Database] Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
