const nasToken = require("nas-token")
const games = require("jd-games")

function verify(token, callback) {
    nasToken.verify(token, (err, payload) => {
        if (err) return callback(err)

        return callback(null, payload)
    })
}

function isDev(payload) {
    return payload.dev = false
}

function isQC(payload) {
    return payload.qc = false
}

function isTestToken(token = "") {
    return config.secrets.testTokens.includes(token.toLowerCase())
}

function nasAuthPermit(req, res, next) {

    if (req.token)
        return next();
    
    let token
    if (req.body && req.body.token) {
        token = req.body.token
    }

    if (!token) {
        res.set("WWW-Authenticate", "NasToken");
        return next({
            status: 401,
            message: "NasToken is required."
        })
    }

    if (isTestToken(token)) {
        req.token = {
            dev: true,
            qc: true
        }
        req.isDev = true;
        req.isQC = true;
        return next()
    };

    return verify(token, function (err, payload) {
        if (err || !payload) {
            return next({
                status: 401,
                message: "Error occured while decrypting token.",
                error: [err]
            })
        }

        req.token = payload;

        req.sid = payload.sid;
        req.gid = payload.gid;
        req.uid = payload.uid;

        req.game = games.getById(payload.gid);
        
        req.isDev = isDev(payload)
        req.isQC = isQC(payload)

        if (req.body.gid) req.gameId = req.body.gid

        return next();
    });
}


function nasAuthRequire(req, res, next) {
    if (config.bypassAuth && !req.body.token)
        return next();

    return nasAuthPermit(req, res, function (err) {
        if (err) return next(err);

        if (!req.token) {
            res.set("WWW-Authenticate", "NasAuth");
            return next({
                status: 401,
                message: "NasAuth is required."
            })
        }

        return next();
    });
}

function nasAuthDev(req, res, next) {
    if (config.bypassAuth && !req.body.token)
        return next();

    return nasAuthPermit(req, res, function (err) {
        if (err) return next(err);

        if (!req.token || !req.isDev) {
            res.set("WWW-Authenticate", "NasAuth");
            return next({
                status: 401,
                message: "NasAuth developer is required."
            })
        }

        return next();
    });
}

function nasAuthQC(req, res, next) {
    if (onfig.bypassAuth && !req.body.token)
        return next();

    return nasAuthPermit(req, res, function (err) {
        if (err) return next(err);

        if (!req.token || !req.isQC) {
            res.set("WWW-Authenticate", "NasAuth");
            return next({
                status: 401,
                message: "NasAuth QC is required."
            })
        }

        return next();
    });
}

module.exports = {
    dev: nasAuthDev,
    qc: nasAuthQC,
    permit: nasAuthPermit,
    require: nasAuthRequire,
    isTestToken
};