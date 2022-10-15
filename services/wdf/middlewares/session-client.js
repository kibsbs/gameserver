const session = require("jd-session")

module.exports = async (req, res, next) => {

    if (!req.funcData) return next(); // If theres no funcdata pass
    if (!req.funcData.sessionRequired) return next(); // If there is funcdata but func doesnt need session check pass

    const sessionId = req.sessionId
    const version = req.version

    if (!sessionId || !version) return next({
        status: 400,
        message: `Session is required for this request.`
    })

    const result = await session.db.findOne({
        sessionId,
        version
    })
    if (!result) return next({
        status: 400,
        message: `Got sessionId but no session was found.`
    })
    else {

        req.session = result
        req.player = result.player
        return next();
    }

}