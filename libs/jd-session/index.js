
class Session {

    constructor() {
        this.db = require("models/session")
    }

    db() {
        return this.db
    }

    client(req, res, next) {
        return require("./client")(req, res, next)
    }

    async new(sessionData) {
        try {
            let newSession = new this.db(sessionData)
            await newSession.save()
            return newSession
        }
        catch(err) {
            throw new Error(`Error occured while trying to create session:\n ${err}`)
        }
    }

    async get(query = {}) {
        return await this.db.findOne(query)
    }

    async getMany(query = {}, limit) {
        return await this.db.find(query).limit(limit)
    }

    async update(query = {}, data = {}) {
        return await this.db.findOneAndUpdate(query, data)
    }

    async exists(query = {}) {
        return await this.db.exists(query)
    }

    async delete(query = {}) {
        return await this.db.findOneAndDelete(query)
    }

}

module.exports = new Session();