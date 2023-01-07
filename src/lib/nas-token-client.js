const nasToken = require("nas-token");
const utils = require("utils");
const games = require("games");
const cheatDetection = require("cheat-detection");

// Used if token is not required but should be set in request
module.exports.permit = async (req, res, next) => {
    if (req.token) return next();

    let token = req.body.token;
    if (!token) return next();
    
    try {
        let payload = nasToken.decrypt(token);
        let { gid, sid, uid, rgn, loc } = payload;

        // Check if client's game is available to play
        if (!games.isGameAvailable(gid))
            return next({
                status: 401,
                message: `${gid} is disabled on this server!`
            });
        
        
        // Don't allow banned users
        const isBanned = await cheatDetection.isUserBanned(uid);
        console.log(uid, gid, isBanned)
        if (isBanned) return next({
            status: 403,
            message: `Forbidden`
        });
        
        req.token = payload;
        req.game = games.getGameById(gid);
        req.uid = uid;
        req.sid = sid;
        req.gid = gid;
        req.rgn = rgn;
        req.loc = loc;

        req.isDev = utils.isDev() ? true : false;
        req.isTest = utils.isDev() ? true : false;
        return next();
    }
    catch(err) {
        return next({
            status: 400,
            message: `Can't validate token`,
            error: err
        });
    };
};

// Used if token is required
module.exports.require = async (req, res, next) => {
    return await this.permit(req, res, (err) => {
        if (err) return next(err);

        if (!req.token) {
            res.set("WWW-Authenticate", "NasToken");
            return next({
                status: 401,
                message: `Token is required!`
            });
        };

        return next();
    });
};

// Used for developer access
module.exports.dev = async (req, res, next) => {
    return await this.permit(req, res, (err) => {
        if (err) return next(err);

        if (!req.token || !req.isDev) {
            res.set("WWW-Authenticate", "NasToken");
            return next({
                status: 401,
                message: `Token is required!`
            });
        };

        return next();
    });
};