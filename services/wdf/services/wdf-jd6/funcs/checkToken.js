const wdfUtils = require("wdf-utils")

module.exports = {

    name: `checkToken`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        if (!wdfUtils.canPlayerConnect(req.ticket)) 
            return res.status(403).send()
            
        global.logger.info(`${req.userId} user connected from ${req.game.name} ${req.game.region}!`)
        return res.status(200).uenc()
    }
}