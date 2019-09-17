const express = require('express')
const { MovieService } = require('../services')

function moviesApi(app) {
    const router = express.Router()
    const movieService = new MovieService()

    app.use('/api/movies', router)

    router.get('/', async function (req, res, next) {
        const { tags } = req.query
        try {
            const movies = await movieService.getMovies({ tags })
            res.status(200).json({
                data: movies,
                message: 'movies listed'
            })
        } catch (error) {
            next(error)
        }
    })

    router.get('/:movieId', async function (req, res, next) {
        const { movieId } = req.params
        try {
            const movie = await movieService.getMovie({ movieId })
            res.status(200).json({
                data: movie,
                message: 'movie by id'
            })
        } catch (error) {
            next(error)
        }
    })

    router.post('/', async function (req, res, next) {
        const { body: movie } = req
        try {
            const createdMovieId = await movieService.createMovie({ movie })
            res.status(201).json({
                data: createdMovieId,
                message: 'movies created'
            })
        } catch (error) {
            next(error)
        }
    })

    router.put('/:movieId', async function (req, res, next) {
        const { body: movie } = req
        const { movieId } = req.params

        try {
            const updatedOrCreatedMovieId = await movieService.updateOrCreateMovie({ movieId, movie })
            res.status(200).json({
                data: updatedOrCreatedMovieId,
                message: 'movie updated or created'
            })
        } catch (error) {
            next(error)
        }
    })

    router.patch('/:movieId', async function (req, res, next) {
        const { body: movie } = req
        const { movieId } = req.params

        try {
            const updatedMovieId = await movieService.updateMovie({ movieId, movie })
            res.status(200).json({
                data: updatedMovieId,
                message: 'movie updated'
            })
        } catch (error) {
            next(error)
        }
    })

    router.delete('/:movieId', async function (req, res, next) {
        const { movieId } = req.params
        try {
            const deletedMovieId = await movieService.deleteMovie({ movieId })
            res.status(200).json({
                data: deletedMovieId,
                message: 'movie deleted'
            })
        } catch (error) {
            next(error)
        }
    })

}

module.exports = moviesApi