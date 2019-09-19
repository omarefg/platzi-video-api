const assert = require('assert')
const proxyquire = require('proxyquire')

const { MongoLibMock, getAllStub, moviesMock } = require('../utils/mocks')

describe('services - movies', () => {
    const MoviesService = proxyquire('../services/MovieService', {
        '../lib/MongoLib': MongoLibMock
    })

    const moviesService = new MoviesService() 
    
    describe('When getMovies method is called', async () => {
        it('should call the getall MongoLib method', async () => {
            await moviesService.getMovies({})
            assert.strictEqual(getAllStub.called, true)
        })

        it('should return an array of movies', async () => {
            const result = await moviesService.getMovies({})
            const expected = moviesMock
            assert.deepStrictEqual(result, expected)
        })
    })
})