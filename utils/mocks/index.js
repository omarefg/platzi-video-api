const { moviesMock, filterMoviesMock, MoviesServiceMock } = require('./movies')
const { getAllStub, createStub, MongoLibMock } = require('./mongo-lib')

module.exports = {
    moviesMock,
    filterMoviesMock,
    MoviesServiceMock,
    getAllStub,
    createStub,
    MongoLibMock
}
