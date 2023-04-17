import { DataTypes, Model } from 'sequelize';
import sequelize from '../index';
import { IUser } from 'database/entities';

interface UserModel extends Model<IUser>, IUser {}

export const Users = sequelize.define<UserModel>('users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
