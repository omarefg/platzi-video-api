const MongoLib = require('../lib/MongoLib')

class ApiKeyService {
    constructor() {
        this.collection = 'api-keys'
        this.mondoDB = new MongoLib()
    }

    async getApiKey({ token }) {
        const [apiToken] = await this.mondoDB.getAll(this.collection, { token })
        return apiToken
    }
}

module.exports = ApiKeyService
