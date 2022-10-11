
class DancerCard {

    constructor() {
        this.db = require("models/dancer-card")
    }

    db() {
        return this.db
    }

    client(req, res, next) {
        return require("./client")(req, res, next)
    }

    async new(dcData) {
        try {
            let newProfile = new this.db(dcData)
            await newProfile.save()
            return newProfile
        }
        catch(err) {
            throw new Error(`Error occured while trying to create dancerCard:\n ${err}`)
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

module.exports = new DancerCard();