const utils = require("utils");
const session = require("wdf-session");

module.exports = {

    name: `disconnectFromWDF`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
        // We wont use sid from body can be used for hijacking
        // TODO: would it be ok to detect if sid and token sid doesnt match and ban player? (means they are hijacking)
        const { sid } = req.body;
        try {
            await session.delete({ sessionId: req.sessionId })
            await lobby.leave(req.sessionId, req.version)

            global.logger.success(`${req.userId} disconnected from WDF of ${req.gameId}`)
            return res.uenc({})
        }
        catch(err) {
            global.logger.error(`Error while trying to disconnect ${req.sessionId} from WDF:\n${err}`)
            return next({
                status: 500,
                message: `Error while trying to disconnect ${req.sessionId} from WDF`,
                error: [err]
            });
        }

    }
}