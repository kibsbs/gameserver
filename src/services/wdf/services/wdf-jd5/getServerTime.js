const utils = require("wdf-utils");

/**
 * getServerTime is for the game to sync with the server time
 */
module.exports = {
    name: `getServerTime`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        try {
            return res.uenc({
                t: utils.serverTime(),
                sendscore_interval: global.config.DURATIONS.send_stars_delay / 1000,

                happyhour: utils.serverTime(Date.now() + 86400000),
                happyhour_duration: 3600000
            });
        }
        catch (err) {
            return next({
                status: 500,
                message: `Can't get server time: ${err}`,
                error: err.message
            });
        }
    }
}