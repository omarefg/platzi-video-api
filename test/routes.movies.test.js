const assert = require('assert')
const proxyquire = require('proxyquire')

const { moviesMock, MoviesServiceMock } = require('../utils/mocks')

const testServer = require('../utils/test-server')

describe('route - movies', () => {
    const route = proxyquire('../routes/movies', {
        '../services/MovieService': MoviesServiceMock
    })

    const request = testServer(route) 
    
    describe('GET /movies', () => {
        it('sould response with status 200', done => {
            request.get('/api/movies').expect(200, done)
        })

        it('should response with the list of movies', done => {
            request.get('/api/movies').end((_err, res) => {
                assert.deepStrictEqual(res.body, {
                    data: moviesMock,
                    message: 'movies listed'
                })

                done()
            })
        })
    })
})