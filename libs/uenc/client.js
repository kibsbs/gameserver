module.exports = function(req, res, next) {
    const uenc = require("uenc")

    res.uenc = function(msg) {
        res.type("application/x-www-form-urlencoded")
        return res.send(uenc.serialize(msg))
    }

    res.wdf = function(msg) {
        return res.send(uenc.serializeWdf(msg))
    }

    return next();
};