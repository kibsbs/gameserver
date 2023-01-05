/**
 * Provides all basic middlewares for all services.
 */

const uuid = require("uuid");
const utils = require("utils");

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