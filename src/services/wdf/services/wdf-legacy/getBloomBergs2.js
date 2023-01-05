const wdfUtils = require("wdf-utils");

const Session = require("wdf-session");

module.exports = {

    name: `getBloomBergs2`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {

        const session = new Session(2016);
        let av = await session.findAvailableLobby();
        console.log(av)
        return res.uenc()
    }
}