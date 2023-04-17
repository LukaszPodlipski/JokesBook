import { DataTypes, Model } from 'sequelize';
import sequelize from '../index';
import { IComment } from 'database/entities';

interface CommentModel extends Model<IComment>, IComment {}

export const Comments = sequelize.define<CommentModel>(
  'comment',
  {
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
    jokeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'jokes',
        key: 'id',
      },
    },
  },
  {
    timestamps: true,
  }
);
