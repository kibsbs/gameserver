const utils = require("utils")

const lobby = require("jd-lobby")
const session = require("jd-session")

module.exports = {

    name: `connectToWDF`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const { avatar, name, onlinescore, pays } = req.body

        if (await session.exists({ sessionId: req.sessionId })) {
            await session.delete({ sessionId: req.sessionId })
            global.logger.info(`${req.sessionId} ${name} already had a previous session, removing their session...`)
        }

        // Get amount of players from player's country by gameId
        const playersInCountry = await session.db.count({ pays, gameId: req.gameId })

        // Join player into an available lobby
        const playerLobby = await lobby.join(req.sessionId, req.version)

        // Create a new session for player
        try {
            await session.new({
                version: req.version,
                sessionId: req.sessionId,
                lobbyId: playerLobby.lobbyId,
                player: {
                    avatar,
                    name,
                    onlinescore,
                    country: pays
                }
            });
            global.logger.success(`${name} connected to WDF of ${req.gameId} and joined lobby ${playerLobby.lobbyId}`)
            return res.uenc({
                sid: req.sessionId,
                players_in_country: playersInCountry,
                t: utils.getServerTime()
            })
        }
        catch(err) {
            global.logger.error(`Error while trying to create session for ${name}:\n${err}`)
            return next({
                status: 500,
                message: `Error occured while trying to create a session for ${req.sessionId}`,
                error: [err]
            });
        }

    }
}