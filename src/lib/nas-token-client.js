const nasToken = require("nas-token");
const utils = require("utils");
const games = require("games");

// Used if token is not required but should be set in request
module.exports.permit = (req, res, next) => {
    if (req.token) return next();

    let token = req.body.token;
    if (!token) return next();
    
    try {
        let payload = nasToken.decrypt(token);
        
        req.token = payload;
        req.game = games.getGameById(payload.gid);
        req.uid = payload.uid;
        req.sid = payload.sid;
        req.gid = payload.gid;
        req.rgn = payload.rgn;
        req.loc = payload.loc;

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
module.exports.require = (req, res, next) => {
    return this.permit(req, res, (err) => {
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
module.exports.dev = (req, res, next) => {
    return this.permit(req, res, (err) => {
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