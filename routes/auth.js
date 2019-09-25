const express = require('express')
const passport = require('passport')
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const ApiKeyService = require('../services/ApiKeyService')
const { config } = require('../config')

// Basic Strategy
require('../utils/auth/strategies/basic')

function authApi(app) {
    const router = express.Router()
    app.use('/api/auth', router)

    const apiKeyService = new ApiKeyService()

    router.post('/sign-in', async (req, res, next) => {
        const { apiKeyToken } = req.body
        if (!apiKeyToken) {
            next(boom.unauthorized('Api Key Token is required'))
        }

        passport.authenticate('basic', (error, user) => {
            try {
                console.log('epaaa hay un error que es', error)
                console.log('epaaa usuario es', user)
                if (error || !user) {
                    next(boom.unauthorized())
                }

                req.login(user, { session: false }, async error => {
                    if (error) {
                        next(error)
                    }

                    const apiKey = apiKeyService.getApiKey({ apiKeyToken })

                    if (apiKey) {
                        next(boom.unauthorized())
                    }

                    const { _id: id, name, email } = user

                    const payload = {
                        sub: id,
                        name,
                        email,
                        scopes: apiKey.scopes
                    }

                    const token = jwt.sign(payload, config.authJwtSecret, {
                        expiresIn: '15m'
                    })

                    return res.status(200).json({
                        token,
                        user: { id, name, email }
                    })
                })
            } catch (error) {
                next(error)
            }
        })(req, res, next)
    })
}

module.exports = authApi