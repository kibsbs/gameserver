const utils = require("wdf-utils");

module.exports = {
    name: `getServerTime`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        return res.uenc({
            t: utils.serverTime(),
            sendscore_interval: global.config.DURATIONS.send_stars_delay / 1000
        });
    }
}