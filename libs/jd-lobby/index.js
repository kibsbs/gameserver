
class Session {

    constructor() {
        this.db = require("models/lobby")
    }

    db() {
        return this.db
    }

    client(req, res, next) {
        return require("./client")(req, res, next)
    }

    async new(lobbyData) {
        try {
            let newLobby = new this.db(lobbyData)
            await newLobby.save()
            
            return newLobby
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

    async join(sessionId, version) {

        // Make sure to make sid leave any previous lobbies they were in
        const prevLobby = await this.db.findOne({ version, sessions: sessionId })
        if (prevLobby) {
            global.logger.info(`${sessionId} is already in a lobby, leaving ${prevLobby.lobbyId}`)
            await this.leave(sessionId, version)
        }

        // Find a lobby to enter for client
        const lobby = await this.findAvailableLobby(version)

        // Once a lobby is found push their session id to lobby's sessions array
        await lobby.updateOne({
            $push: { sessions: sessionId }
        })
        
        return lobby;

    }

    async leave(sessionId, version) {
        await this.db.updateMany({
            version,
            sessions: sessionId
        }, {
            $pullAll: {
                sessions: [ sessionId ]
            }
        })
    }

    async findAvailableLobby(version) {

        const maxSessions = global.config.lobby.maxSessions || 8

        // Find available lobby for player with their version and lobby with available space
        const lobby = await this.db.findOne({
            version,
            $where: `${maxSessions}>this.sessions.length`
        });

        // No available lobby found we can create a new one
        if (!lobby) {
            global.logger.info("No lobby found, creating a new one!")
            
            const newLobby = await this.new({ version })
            return newLobby
        }

        // A lobby was found return it
        else {
            global.logger.info("Existing lobby found! " + lobby.lobbyId)
            return lobby
        }

    }

}

module.exports = new Session();