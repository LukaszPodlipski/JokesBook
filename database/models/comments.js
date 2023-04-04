const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Comment = sequelize.define('comment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  jokeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jokes',
      key: 'id'
    }
  },
},{
  timestamps: true,
});

module.exports = Comment;