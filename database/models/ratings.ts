import { DataTypes, Model } from 'sequelize';
import sequelize from '../index';
import { IRating } from 'database/entities';

interface RatingModel extends Model<IRating>, IRating {}

export const Ratings = sequelize.define<RatingModel>('ratings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jokeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jokes',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
});
