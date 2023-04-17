import { Comments } from '../../database/models/comments';
import { Users } from '../../database/models/users';
import { Categories } from '../../database/models/categories';
import { Ratings } from '../../database/models/ratings';

const getJokeComments = async (jokeId) => {
  return await Promise.all(
    await Comments.findAll({ where: { jokeId } }).then((comments) =>
      comments.map(async (comment) => {
        const author = await Users.findOne({
          where: { id: comment.userId },
        });
        return {
          id: comment.id,
          content: comment.content,
          authorName: author.name,
          authorId: author.id,
          createdAt: comment.createdAt,
        };
      })
    )
  );
};

const getJokeCategory = async (categoryId) => {
  return await Categories.findOne({ where: { id: categoryId } }).then((category) => ({ id: categoryId, name: category.name }));
};

const getJokeRate = async (jokeId) => {
  console.log(Ratings.findAll);
  const ratings = (await Ratings.findAll({ where: { jokeId } })) || [];
  const rate = ratings.map((obj) => Number(obj?.rate))?.reduce((acc, curr) => acc + curr, 0) / ratings?.length || 0;
  return rate;
};

const getJokeUser = async (userId) => {
  return await Users.findOne({ where: { id: userId } }).then((user) => user.name);
};

const getCompleteJoke = async (jokeId, categoryId, userId, content) => {
  const rate = await getJokeRate(jokeId);
  const comments = await getJokeComments(jokeId);
  const category = await getJokeCategory(categoryId);
  const user = await getJokeUser(userId);
  return {
    id: jokeId,
    category,
    user,
    content,
    rate,
    comments,
  };
};

export { getCompleteJoke, getJokeComments, getJokeCategory, getJokeRate, getJokeUser };
