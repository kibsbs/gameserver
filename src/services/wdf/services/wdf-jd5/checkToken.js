const Session = require("wdf-session");
const cache = require("cache");

module.exports = {
    name: `checkToken`,
    description: `Verifies player's token and checks if they can connect online.`,
    version: `1.0.1`,
    async init(req, res, next) {

        const session = new Session(req.version);

        const canConnect = await session.canUserConnect(req.uid);
        if (!canConnect) {
            global.logger.info(`${req.uid} with ${req.game.id} received 401 from checkToken!`)
            return next({
                status: 401,
                message: `User is not allowed to create connection to WDF!`
            });
        }

        return res.uenc();
    }
}