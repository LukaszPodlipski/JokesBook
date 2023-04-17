import { DataTypes, Model } from 'sequelize';
import sequelize from '../index';
import { ICategory } from 'database/entities';

interface CategoryModel extends Model<ICategory>, ICategory {}

export const Categories = sequelize.define<CategoryModel>('categories', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
