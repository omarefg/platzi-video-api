const { config } = require('../config')

function cacheResponse (res, seconds) {
    if (!config.dev) {
        res.set('cache-control', `public, max-age=${seconds}`)
    }
}

module.exports = cacheResponse