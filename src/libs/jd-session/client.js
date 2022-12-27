module.exports = async (req, res, next) => {

    const session = require("jd-session")

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
        return next();
    }

}