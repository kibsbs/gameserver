const session = require("wdf-session");
const cache = require("cache");

module.exports = {
    name: `checkToken`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
    
        let canConnect = await session.canUserConnect(req.uid);

        if (!canConnect) return next({
            status: 401,
            message: `User is not allowed to create connection to WDF!`
        });

        return res.uenc();
    }
}