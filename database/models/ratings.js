const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Ratings = sequelize.define('ratings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jokeId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jokes',
      key: 'id'
    }
  },
  userId:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
});

module.exports = Ratings;