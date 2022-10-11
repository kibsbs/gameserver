

module.exports = async function(req, res, next) {

    const dancerProfile = require("jd-dancercard")

    if (!req.token || !req.token.uid)
        return next({
            status: 401,
            message: `Auth required for profile client.`
        })
    
    const profile = await dancerProfile.get({ userId: req.token.uid })
    if (!profile)
        return next({
            status: 401,
            message: `Profile not found, profile required for profile client.`
        })

    req.profile = profile
    return next();
}