/**
 * Provides all basic middlewares for all services.
 */

const uuid = require("uuid");
const utils = require("utils");
const ipRangeCheck = require("ip-range-check");

function isSuccessful(status) {
    return status >= 200 && status <= 300
};

// Handles any server error and serves prettifies responses.
module.exports.errorHandler = (err, req, res, next) => {
    let data = {};

    data.status = err.status || 400;
    data.success = isSuccessful(data.status);
    data.message = err.message || "Unknown error occured.";
    if (err.error) data.error = err.error;
    
    data.requestId = uuid.v4();
    data.serverTime = new Date();

    if (err.error) {
        global.logger.error({
            path: req.originalUrl,
            ip: req.ip,
            body: JSON.stringify(req.body || {}),
            error: err.error
        });
    }

    if (global.gs.SHOW_RESPONSE_MESSAGES)
        return res.status(data.status).json(data);
    else
        return res.status(data.status).send();
};

module.exports.notFound = (req, res, next) => {
    if (utils.isDev()) return next();
    else return res.status(404).send();
};

module.exports.userAgentCheck = (req, res, next) => {
    const userAgent = req.headers["user-agent"];
    const validAgent = global.gs.VALID_USER_AGENT;

    if (userAgent !== validAgent) {
        global.logger.warn({
            message: `${req.ip} tried to access ${req.original} with invalid agent!`,
            headers: req.headers,
            body: req.body
        });
        return res.status(403).send();
    };
    return next();
};

const ipList = global.gs.BLOCKLIST.map(a => a.ips).flat(2);
module.exports.ipBlocklist = (req, res, next) => {
    const ip = req.ip;
    const check = ipRangeCheck(ip, ipList)

    if (check) {
        global.logger.warn({
            message: `Blocked IP ${ip} tried to access ${req.original}!`,
            headers: req.headers,
            body: req.body
        });
        return next({
            status: 403
        })
    }

    return next();
};