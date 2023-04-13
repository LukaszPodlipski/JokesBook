const Comments = require('../../database/models/comments')
const Users = require('../../database/models/users')
const Categories = require('../../database/models/categories')
const Ratings = require('../../database/models/ratings')

const getJokeComments = async (jokeId) => {
  return await Promise.all(
    await Comments.findAll({ where: { jokeId } }).then(comment => comment.map(async comment => {
      const author = await Users.findOne({ where: { id: comment.userId } });
      return {
        id: comment.id,
        content: comment.content,
        authorName: author.name,
        authorId: author.id,
        createdAt: comment.createdAt
      }
    })));
}

const getJokeCategory = async (categoryId) => {
  return await Categories.findOne({ where: { id: categoryId } }).then(category => ({ id: categoryId, name: category.name }))
}

const getJokeRate = async (jokeId) => {
  const ratings = await Ratings.findAll({ where: { jokeId } }) || [];
  const rate = ratings.map(obj => Number(obj?.rate))?.reduce((acc, curr) => acc + curr, 0) / ratings?.length || 0;
  return rate;
}

module.exports = { getJokeComments, getJokeCategory, getJokeRate }