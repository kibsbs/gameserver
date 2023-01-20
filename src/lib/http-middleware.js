/**
 * Provides all basic middlewares for all services.
 */

const uuid = require("uuid");
const utils = require("utils");

const isSuccessful = (status) => status >= 200 && status <= 300;

// Handles any server error and serves prettifies responses
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

    // Only show error messages in response if it's true in config and if server is dev
    if (utils.isDev() || req.headers.hasOwnProperty("x-show-resp"))
        return res.status(data.status).json(data);
    else
        return res.status(data.status).send();
};

// Validates client's User Agent
module.exports.agentCheck = (req, res, next) => {
    const userAgent = req.headers["user-agent"];
    const validAgent = global.gs.VALID_USER_AGENT;

    if (utils.isDev()) return next();
    
    if (userAgent !== validAgent) {
        global.logger.warn({
            msg: `${req.ip} tried to access ${req.originalUrl} with invalid agent!`,
            headers: req.headers,
            body: req.body
        });
        return res.status(403).send();
    };

    return next();
};

// Used for returning 404 for unknown routes
module.exports.notFound = (req, res, next) => {
    if (utils.isDev()) return next();
    else return res.status(404).send();
};