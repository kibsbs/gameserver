const dancercard = require("dancercard");

module.exports = async (req, res, next) => {
    if (!req.uid)
        return next({
            status: 401,
            message: `UID required for Dancercard client!`
        });

    let profile = await dancercard.get({ userId: req.uid });
    if (!profile)
        return next({
            status: 401,
            message: `Client does not have a profile!`
        });

    req.profile = profile;
    return next();
}