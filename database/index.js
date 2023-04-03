require("dotenv").config();

const Sequelize = require('sequelize');

// create a new sequelize instance with the local postgres database information.
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
});

// test the connection to the database
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;