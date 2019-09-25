const express = require('express')
const joi = require('@hapi/joi')

const UserMovieService = require('../services/UserMovieService')
const validationHandler = require('../utils/middlewares/validation-handler')

const {
    movieIdSchema,
    userIdSchema,
    createUserMovieSchema
} = require('../utils/schemas')

function userMoviesApi(app) {
    const router = express.Router()
    app.use('/api/user-movies', router)

    const userMovieService = new UserMovieService()

    router.get(
        '/',
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