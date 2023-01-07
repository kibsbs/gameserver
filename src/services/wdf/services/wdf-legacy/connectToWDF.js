const utils = require("wdf-utils");

const Session = require("wdf-session");
const cheatDetection = require("cheat-detection");
const cache = require("cache");

module.exports = {

    name: `connectToWDF`,
    description: `Connects user to WDF, creating session and adding user to a lobby.`,
    version: `1.5.0`,

    async init(req, res, next) {

        const { avatar, name, onlinescore, pays } = req.body;

        const session = new Session(req.game.version);
        const sessionId = req.sid;
        const playersInCountry = await session.getCountryPlayers(pays);

        const cacheData = { 
            avatar, 
            name, 
            rank: onlinescore, 
            country: pays 
        };

        // Create session cache for client
        await session.createSessionCache(sessionId, cacheData);
        
        global.logger.info(`${req.uid} // ${name} connected WDF of ${req.game.version} - ${req.game.id}`);

        return res.uenc({
            sid: req.sid,
            players_in_country: playersInCountry,
            t: utils.serverTime()
        });
    }
}