const fs = require("fs")

const games = require("jd-games")

module.exports = (serviceName, dirName) => {

    return (req, res, next) => {

        const functions = global.config.functions
    
        let funcName = req.query.d,
            funcPath = dirName + "/funcs/" + funcName + ".js"
    
        // If query has "json" it means response must be json even if json query is empty make it true
        let isJson = req.query.json ? true : false
        if (req.query.json === "") isJson = true
    
        if (!funcName || !functions[funcName] || !fs.existsSync(funcPath))
            return next({
                status: 404,
                message: `${funcName} is not an existing function, try again later.`
            });
    
        let funcData = functions[funcName]
    
        req.serviceName = serviceName

        req.isJson = isJson
        req.methodId = funcData.id

        req.funcData = funcData
        req.funcPath = funcPath
    
        // If requested func requires a token make sure we assign every necessary thing to req
        if (funcData.tokenRequired && req.body.token) {
            req.ticket = req.body.token
            req.userId = req.body.token.uid
            req.sessionId = req.body.token.sid
            req.gameId = req.body.token.gid
            req.game = games.getById(req.gameId)
            req.version = req.game.version
        }
    
        return next();
    
    }
}