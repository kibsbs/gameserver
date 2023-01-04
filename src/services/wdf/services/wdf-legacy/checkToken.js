const session = require("wdf-session");

module.exports = {
    name: `checkToken`,
    description: ``,
    version: `1.0.0`,

    async init(req, res, next) {
    
        let id = req.uid || req.pid;
        let canConnect = await session.canUserConnect(id);

        if (!canConnect) return next({
            status: 401,
            message: `User is not allowed to create connection to WDF!`
        });

        return res.uenc();
    }
}