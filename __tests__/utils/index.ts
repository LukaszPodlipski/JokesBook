import jwt from 'jsonwebtoken';
import { Jokes } from '../../database/models/jokes';
import { Categories } from '../../database/models/categories';
import { getValidatedUser } from '../../controllers/authController';
import { getRandomJokeUtil } from '../../controllers/utils';

const secretKey = process.env.SECRET_KEY;

const getValidUserAndToken = async () => {
  const payload = {
    body: {
      email: 'apodlipski@edu.cdv.pl',
      password: 'admin',
    },
  };
  const user = await getValidatedUser(payload.body);
  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
  return { user, token };
};

const getExistingJokeId = async () => {
  const joke = await Jokes.findOne();
  return joke.id;
};

const getNotExistingJokeId = async () => {
  const randomId = Math.floor(Math.random() * 1000000) + 1000000;
  const joke = await Jokes.findOne({ where: { id: randomId } });
  if (joke) {
    return await getNotExistingJokeId();
  } else {
    return randomId;
  }
};

const getUserJokeId = async (userId: number): Promise<number> => {
  const joke = await Jokes.findOne({ where: { userId } });
  return joke.id;
};

const getNotUserJokeId = async (userId: number) => {
  const joke = await getRandomJokeUtil();
  if (joke.userId === userId) {
    return await getNotUserJokeId(userId);
  } else {
    return joke.id;
  }
};

const getJokeExampleBody = async (valid = true) => {
  if (valid) {
    const existingCategory = await Categories.findOne();
    return {
      body: {
        content: 'Example joke content',
        categoryId: existingCategory.id,
      },
    };
  } else {
    return {
      body: {
        invalidContentKey: 'Example joke content',
        invalidCategoryIdKey: 1,
      },
    };
  }
};

const getRateExampleBody = async (valid = true) => {
  if (valid) {
    return {
      body: {
        rate: 5,
      },
    };
  } else {
    return {
      body: {
        invalidRateKey: 5,
      },
    };
  }
};

const getCommentExampleBody = async (valid = true) => {
  if (valid) {
    return {
      body: {
        content: 'Example comment content',
      },
    };
  } else {
    return {
      body: {
        invalidContentKey: 'Example comment content',
      },
    };
  }
};

export {
  getValidUserAndToken,
  getExistingJokeId,
  getNotExistingJokeId,
  getUserJokeId,
  getNotUserJokeId,
  getJokeExampleBody,
  getRateExampleBody,
  getCommentExampleBody,
};
