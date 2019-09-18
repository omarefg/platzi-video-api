'use strict'
const boom = require('@hapi/boom')

const { config } = require('../../config')

function withErrorStack (err, stack) {
    if (config.dev) {
        return { ...err, stack }
    }
    return err
}

function logErrors (err, req, res, next) {
    console.log(err)
    next(err)
}

function wrapError (err, req, res, next) {
    if (!err.isBoom) {
        next(boom.badImplementation(err))
    }

    next(err)
}

function errorHandler (err, req, res, next) { //eslint-disable-line
    const { output: { statusCode, payload } } = err
    res.status(statusCode)
    res.json(withErrorStack(payload, err.stack))
}

function notFoundHandler (req, res) {
    const { output: { statusCode, payload } } = boom.notFound()

    res.status(statusCode).json(payload)
}

module.exports = {
    logErrors,
    errorHandler,
    wrapError,
    notFoundHandler
}

