const wdfUtils = require("wdf-utils");
const Session = require("wdf-session");

module.exports = {
    name: `getBloomBergs2`,
    description: `Used for the game to retreive top country statistics.`,
    version: `0.0.0`,

    async init(req, res, next) {
        // TODO
        return res.uenc()
    }
}