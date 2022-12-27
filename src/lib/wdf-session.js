
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

    async count(version, sessionId) {
        return await this.db.count({
            version
        })
    }

    async ping(version, sessionId) {
        return await this.db.findOneAndUpdate({
            version, sessionId
        }, { updatedAt: Date.now() })
    }

    async updateOnlineScore(version, sessionId, newOnlineScore) {
        const scoreDb = require("models/score")

        await this.db.findOneAndUpdate({ version, sessionId }, {
            "player.onlinescore": newOnlineScore
        })

        await scoreDb.findOneAndUpdate({ version, sessionId }, {
            "player.onlinescore": newOnlineScore
        })
        
        return newOnlineScore
    }

}

module.exports = new Session();