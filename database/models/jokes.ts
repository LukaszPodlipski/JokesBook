import { DataTypes, Model } from 'sequelize';
import sequelize from '../index';
import { IJoke } from 'database/entities';

interface JokeModel extends Model<IJoke>, IJoke {}

export const Jokes = sequelize.define<JokeModel>('jokes', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categories',
      key: 'id',
    },
  },
});
