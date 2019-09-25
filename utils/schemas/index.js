const movies = require('./movies')
const userMovies = require('./user-movies')
const users = require('./users')

module.exports = {
    ...movies,
    ...userMovies,
    ...users
}