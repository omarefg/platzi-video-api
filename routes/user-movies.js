const express = require('express')
const joi = require('@hapi/joi')
const passport = require('passport')

const UserMovieService = require('../services/UserMovieService')
const validationHandler = require('../utils/middlewares/validation-handler')
const scopeValidationHandler = require('../utils/middlewares/scope-validation-handler')

const {
    movieIdSchema,
    userIdSchema,
    createUserMovieSchema
} = require('../utils/schemas')

// JWT Strategy
require('../utils/auth/strategies/jwt')

function userMoviesApi(app) {
    const router = express.Router()
    app.use('/api/user-movies', router)

    const userMovieService = new UserMovieService()

    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['read:user-movies']),
        validationHandler(joi.object({ userId: userIdSchema }), 'query'),
        async (req, res, next) => {
            const { userId } = req
            try {
                const userMovies = userMovieService.getUserMovies({ userId })
                res.status(200).json({
                    data: userMovies,
                    message: 'user movies listed'
                })
            } catch (error) {
                next(error)
            }
        }
    )

    router.post(
        '/',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['create:user-movies']),
        validationHandler(createUserMovieSchema),
        async (req, res, next) => {
            const { body: userMovie } = req
            try {
                const createdUserMovieId = userMovieService.createUserMovie(
                    userMovie
                )
                res.status(201).json({
                    data: createdUserMovieId,
                    message: 'user movie created'
                })
            } catch (error) {
                next(error)
            }
        }
    )

    router.delete(
        '/:userMovieId',
        passport.authenticate('jwt', { session: false }),
        scopeValidationHandler(['delete:user-movies']),
        validationHandler(joi.object({ userMovieId: movieIdSchema }, 'params')),
        async (req, res, next) => {
            const userMovieId = req.params
            try {
                const deletedUserMovieId = userMovieService.deleteUserMovie({
                    userMovieId
                })
                res.status(200).json({
                    data: deletedUserMovieId,
                    message: 'user movie deleted'
                })
            } catch (error) {
                next(error)
            }
        }
    )
}

module.exports = userMoviesApi
