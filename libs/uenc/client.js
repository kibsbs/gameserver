module.exports = function(req, res, next) {
    const uenc = require("uenc")

    res.uenc = function(msg) {
        
        if (req.isJson) return res.json(msg)
        else {
            if (req.methodId) {
                msg = {
                    method_id: req.methodId,
                    ...msg,
                    stat: 1
                }
                
                res.type("text/html")
                return res.send(uenc.serialize(msg, ";"))
            }
            
            res.type("application/x-www-form-urlencoded")
            return res.send(uenc.serialize(msg))
        }
    }

    res.wdf = function(msg) {
        return res.send(uenc.serializeWdf(msg))
    }

    return next();
};