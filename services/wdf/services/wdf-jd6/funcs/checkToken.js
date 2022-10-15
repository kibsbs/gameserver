const wdfUtils = require("wdf-utils")

module.exports = {

    name: `checkToken`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        if (!wdfUtils.canPlayerConnect(req.ticket)) return res.status(403).send()
            
        // TODO: when logging check if userid has a profile in jeanmich so you can log their name instead of userid
        global.logger.info(`${req.userId} user is now online from ${req.game.name} ${req.game.region}`)

        return res.uenc()
    }
}