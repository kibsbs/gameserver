module.exports = (req, res, next) => {
    const uenc = require("uenc");

    // If force json header is present or if the request is for testing, it will send response in JSON
    const forceJson = req.headers.hasOwnProperty(global.gs.HEADER_FORCE_JSON) || req.isTest;
    
    res.uenc = (data, setIndex = false, offset = 0) => {
        if (forceJson) return res.json(data);
        return res.send(uenc.serialize(data, setIndex, offset));
    };
    
    return next();
}