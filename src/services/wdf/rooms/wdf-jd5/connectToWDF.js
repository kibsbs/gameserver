const utils = require("wdf-utils");

const Session = require("wdf-session");
const cheatDetection = require("cheat-detection");
const cache = require("cache");

/**
 * "connectToWDF" is requested by the game once the user clicks the WDF button on UI.
 * We don't exactly make the player join WDF, we just generate a cache data in memcached
 * Because connectToWDF is where user connects, we generate a cache object that expires in 3h
 * and once they actually join WDF by clicking "join" button in wdf lobby, we generate a session in sendScore
 */
module.exports = {

    name: `connectToWDF`,
    description: `Connects user to WDF, creating session and adding user to a lobby.`,
    version: `1.5.0`,

    async init(req, res, next) {

        try {
            const { avatar, name, onlinescore, pays } = req.body;

            const session = new Session(req.version);
            const sessionId = req.sid;

            const cacheData = {
                avatar,
                name,
                rank: onlinescore,
                country: pays,
                userId: req.uid,
                sessionId: req.sid,
                game: {
                    id: req.game.id,
                    version: req.game.version
                }
            };

            // Create session cache for client
            await session.createSessionCache(sessionId, cacheData);

            global.logger.info(`${req.uid} // ${name} connected WDF of ${req.game.version} - ${req.game.id}`);

            return res.uenc({
                sid: req.sid,
                t: utils.serverTime()
            });
        }
        catch (err) {
            return next({
                status: 500,
                message: `Can't connect to WDF: ${err}`,
                error: err.message
            });

        }
    }
}