const nasToken = require("nas-token");

const TOKEN_KEY = global.gs.TOKEN_KEY;


// Used if token is not required but should be set in request
module.exports.permit = (req, res, next) => {
    if (req.token) return next();

    let token = req.body.token;
    if (!token) return next();
    
    try {
        let payload = nasToken.decrypt(token);
        req.token = payload;
        req.isDev = false;
        req.isTest = false;
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