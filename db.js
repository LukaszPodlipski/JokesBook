const Sequelize = require('sequelize');

// create a new sequelize instance with the local postgres database information.
const sequelize = new Sequelize('postgres', 'postgres', 'admin', {
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