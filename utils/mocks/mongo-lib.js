const sinon = require('sinon')

const { moviesMock, filterMoviesMock } = require('./movies')

const getAllStub = sinon.stub()
getAllStub.withArgs('movies').resolves(moviesMock)

const tagQuery = { tags: { $in: ['Drama'] } }
getAllStub.withArgs('movies', tagQuery).resolves(filterMoviesMock('Drama'))

const createStub = sinon.stub().resolves(moviesMock[0].id)

class MongoLibMock {
    getAll (collection, query) {
        return getAllStub(collection, query)
    }

    create (collection, query) {
        return createStub(collection, query)
    }
}

module.exports = {
    getAllStub,
    createStub,
    MongoLibMock
}