const express = require('express')
const joi = require('@hapi/joi')
const passport = require('passport')
const MovieService = require('../services/MovieService')
const {
    movieIdSchema,
    createMovieSchema,
    updateMovieSchema
} = require('../utils/schemas/movies')

const validationHandler = require('../utils/middlewares/validation-handler')
const scopeValidationHandler = require('../utils/middlewares/scope-validation-handler')

const cacheResponse = require('../utils/cache-response')

const {
    FIVE_MINUTES_IN_SECONDS,
    SIXTY_MINUTES_IN_SECONDS
} = require('../utils/time')

// JWT Strategy
require('../utils/auth/strategies/jwt')

function moviesApi(app) {
    const router = express.Router()
    const movieService = new MovieService()

    app.use('/api/movies', router)

    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['read:movies']),
        async function(req, res, next) {
            const { tags } = req.query
            cacheResponse(res, FIVE_MINUTES_IN_SECONDS)
            try {
                const movies = await movieService.getMovies({ tags })
                res.status(200).json({
                    data: movies,
                    message: 'movies listed'
                })
            } catch (error) {
                next(error)
            }
        }
    )

    router.get(
        '/:movieId',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['read:movies']),
        validationHandler(joi.object({ movieId: movieIdSchema }), 'params'),
        async function(req, res, next) {
            const { movieId } = req.params
            cacheResponse(res, SIXTY_MINUTES_IN_SECONDS)
            try {
                const movie = await movieService.getMovie({ movieId })
                res.status(200).json({
                    data: movie,
                    message: 'movie by id'
                })
            } catch (error) {
                next(error)
            }
        }
    )

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['create:movies']),
        validationHandler(createMovieSchema),
        async function(req, res, next) {
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
        }
    )

    router.put(
        '/:movieId',
        scopeValidationHandler(['update:movies']),
        passport.authenticate('jwt', { session: false }),
        validationHandler({ movieId: movieIdSchema }, 'params'),
        validationHandler(updateMovieSchema),
        async function(req, res, next) {
            const { body: movie } = req
            const { movieId } = req.params

            try {
                const updatedOrCreatedMovieId = await movieService.updateOrCreateMovie(
                    { movieId, movie }
                )
                res.status(200).json({
                    data: updatedOrCreatedMovieId,
                    message: 'movie updated or created'
                })
            } catch (error) {
                next(error)
            }
        }
    )

    router.patch(
        '/:movieId',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['update:movies']),
        async function(req, res, next) {
            const { body: movie } = req
            const { movieId } = req.params

            try {
                const updatedMovieId = await movieService.updateMovie({
                    movieId,
                    movie
                })
                res.status(200).json({
                    data: updatedMovieId,
                    message: 'movie updated'
                })
            } catch (error) {
                next(error)
            }
        }
    )

    router.delete(
        '/:movieId',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['delete:movies']),
        validationHandler({ movieId: movieIdSchema }, 'params'),
        async function(req, res, next) {
            const { movieId } = req.params
            try {
                const deletedMovieId = await movieService.deleteMovie({
                    movieId
                })
                res.status(200).json({
                    data: deletedMovieId,
                    message: 'movie deleted'
                })
            } catch (error) {
                next(error)
            }
        }
    )
}

module.exports = moviesApi
