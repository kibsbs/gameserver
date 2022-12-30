module.exports = (req, res, next) => {
    const uenc = require("uenc");

    // If force json header is present or if the request is for testing, it will send response in JSON
    const forceJson = req.headers.hasOwnProperty(global.gs.HEADER_FORCE_JSON) || req.isTest;
    
    res.uenc = (data, setIndex = false, offset = 0) => {
        if (forceJson) return res.json(data);

        if (global.service.id == "jmcs")
            res.set("Content-Type", "application/x-www-form-urlencoded");
        else if (global.service.id == "wdf")
            res.set("Content-Type", "text/html");
        
        return res.send(uenc.serialize(data, setIndex, offset));
    };
    
    return next();
}