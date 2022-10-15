
class Games {

    constructor() {
        this.db = {}
        this.games = global.config.games
    }

    client(req, res, next) {
        return require("./client")(req, res, next)
    }

    getById(gameId) {
        return this.games[gameId]
    }

    // async getMany(gameIds = []) {
    //     return await this.db.find(query).limit(limit)
    // }

    // async exists(gameId) {
    //     return await this.db.exists(query)
    // }

    // async delete(query = {}) {
    //     return await this.db.findOneAndDelete(query)
    // }

}

module.exports = new Games();