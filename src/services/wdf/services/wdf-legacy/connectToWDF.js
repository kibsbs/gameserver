const utils = require("wdf-utils");

const session = require("wdf-session");

module.exports = {

    name: `connectToWDF`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        const { avatar, name, onlinescore, pays } = req.body;

        // Check if user is allowed to connect to WDF
        const canConnect = await session.canUserConnect(req.uid);
        if (!canConnect) return next({
            status: 401,
            message: `User is not allowed to create connection to WDF!`
        });

        // Amount of players in client's country
        const playersInCountry = await session.getCountryPlayers(pays);
        const sessionExists = await session.exists(req.sid);

        // If client already has a session, delete it
        if (sessionExists) {
            global.logger.info(`${req.game.id} // ${name} joined WDF with an existing session, recreating session...`);
            await session.delete(req.sid);
        }
        else global.logger.info(`${req.game.id} // ${name} joined WDF!`);

        // New session
        await session.new({
            userId: req.uid,
            sessionId: req.sid,
            game: {
                id: req.game.id,
                version: req.game.version
            },
            profile: { 
                avatar, 
                name, 
                rank: onlinescore, 
                country: pays 
            }
        });

        return res.uenc({
            sid: req.sid,
            players_in_country: playersInCountry,
            t: utils.serverTime()
        });
    }
}