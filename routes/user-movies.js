const express = require('express')
const joi = require('@hapi/joi')
const passport = require('passport')

const UserMovieService = require('../services/UserMovieService')
const validationHandler = require('../utils/middlewares/validation-handler')
const scopeValidationHandler = require('../utils/middlewares/scope-validation-handler')

const {
    userMovieIdSchema,
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
            const { userId } = req.query
            try {
                const userMovies = await userMovieService.getUserMovies({ userId })
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
                const createdUserMovieId = await userMovieService.createUserMovie({userMovie})
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
        validationHandler(joi.object({ userMovieId: userMovieIdSchema }), 'params'),
        async (req, res, next) => {
            const { userMovieId } = req.params
            try {
                const deletedUserMovieId = await userMovieService.deleteUserMovie({ userMovieId })
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
