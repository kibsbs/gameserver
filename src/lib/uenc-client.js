const utils = require("utils");

module.exports = (req, res, next) => {

    const uenc = require("uenc");

    // If isJson is true request will be sent in JSON (for testing purposes)
    const isJson = (utils.isDev() && req.query.hasOwnProperty("json"));
    
    res.uenc = (data = {}, setIndex = false, offset = 0) => {
        if (isJson) return res.json(data);

        if (global.service.id == "jmcs")
            res.set("Content-Type", "application/x-www-form-urlencoded");
        else if (global.service.id == "wdf")
            res.set("Content-Type", "text/html");
        
        return res.send(uenc.serialize(data, setIndex, offset));
    };
    
    return next();
}