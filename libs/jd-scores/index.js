
class Scores {

    constructor() {
        this.db = require("models/score")
    }

    db() {
        return this.db
    }

    client(req, res, next) {
        return require("./client")(req, res, next)
    }

    async new(scoreData) {
        try {
            let newScore = new this.db(scoreData)
            await newScore.save()
            return newScore
        }
        catch(err) {
            throw new Error(`Error occured while trying to create a score entry:\n ${err}`)
        }
    }

    async get(query = {}) {
        return await this.db.findOne(query)
    }

    async getMany(query = {}, limit) {
        return await this.db.find(query).limit(limit)
    }

    async exists(query = {}) {
        return await this.db.exists(query)
    }

    async delete(query = {}) {
        return await this.db.findOneAndDelete(query)
    }

}

module.exports = new Scores();