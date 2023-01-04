const time = require("time");

module.exports = {
    name: `getServerTime`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        return res.uenc({
            t: time.secondsDouble(),
            sendscore_interval: global.config.TIMES.SEND_SCORE_INTERVAL
        });
    }
}