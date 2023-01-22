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
            return res.uenc();
        }
        catch (err) {
            return next({
                status: 500,
                message: `Can't get stats: ${err}`,
                error: err.message
            });

        }
    }
}