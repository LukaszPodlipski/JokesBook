import fs from 'fs';
import csv from 'csv-parser';
import sequelize from '../index';
import { User, Category, Joke, Comment, Rating } from '../entities/';
import { Users, Jokes, Categories, Comments, Ratings } from '../associations';
import { hashPassword } from '../../controllers/utils/index';

const seeds = [
  {
    name: 'Categories',
    model: Categories,
    data: './database/seed/data/categories.csv',
    dataModel: (row) => new Category(row),
  },
  {
    name: 'Users',
    model: Users,
    data: './database/seed/data/users.csv',
    dataModel: (row) => new User(row),
  },
  {
    name: 'Jokes',
    model: Jokes,
    data: './database/seed/data/jokes.csv',
    dataModel: (row) => new Joke(row),
  },
  {
    name: 'Ratings',
    model: Ratings,
    data: './database/seed/data/ratings.csv',
    dataModel: (row) => new Rating(row),
  },
  {
    name: 'Comments',
    model: Comments,
    data: './database/seed/data/comments.csv',
    dataModel: (row) => new Comment(row),
  },
];

async function seedModel(seed) {
  fs.createReadStream(seed.data)
    .pipe(csv())
    .on('data', async (row) => {
      const data = row.password ? { ...row, password: await hashPassword(row.password) } : row;
      seed.model.create(seed.dataModel(data));
    })
    .on('end', () => {
      console.log(`[Database] ${seed.name} file successfully processed`);
    });
}

export async function seedDatabase() {
  for (const seed of seeds) {
    const tableName = seed.model.getTableName();
    await sequelize.query(`ALTER TABLE "${tableName}" DISABLE TRIGGER ALL`); //  disables all triggers (including foreign key constraints) for the table being seeded
    await seedModel(seed);
    await sequelize.query(`ALTER TABLE "${tableName}" ENABLE TRIGGER ALL`);
  }
}

export const dropDatabase = async () => {
  try {
    await sequelize.query('DROP SCHEMA public CASCADE;');
    await sequelize.query('CREATE SCHEMA public;');
    console.log('[Database] Schema dropped and created successfully');
  } catch (error) {
    console.error(error);
  }
};
