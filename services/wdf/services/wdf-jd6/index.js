const fs = require("fs")

module.exports = {

    name: `WDF JD6`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        
        global.logger = require("logger")(["WDF", config.serviceName])

        const games = require("jd-games")

        /**
         * Main route
         * 
         * The game will do POST connects under /wdfjd6/?d=example to get traffic of WDF
         */

        const functions = global.config.functions
        
        logger.info(`Running functions: ${functions.join(", ")}`)
        router.post("/", require("schema-validator"), async (req, res, next) => {
            
            let funcName = req.query.d
            let funcPath = __dirname + "/funcs/" + funcName + ".js"

            // If query has "json" it means response must be json
            // even if json query is empty make it true
            let isJson = req.query.json ? true : false
            if (req.query.json === "") isJson = true

            if (!fs.existsSync(funcPath))
                return next({
                    status: 404,
                    message: `${funcName} is not an existing function, try again later.`
                });
            
            req.isJson = isJson
            req.serviceName = "wdfjd6"

            // If requested func requires a token make sure we assign every necessary thing to req
            if (req.body.token) {
                req.ticket = req.body.token
                req.userId = req.body.token.uid
                req.sessionId = req.body.token.sid
                req.gameId = req.body.token.gid
                req.game = await games.getById(req.gameId)
            }

            await require(funcPath).init(req, res, next)
        });

        router.get("/cmu/{id}", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/cmucontest/{id}", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/communities/{id}", (req, res) => {
            return res.send("hello")
        });

        router.get("/configuration", (req, res) => {
            return res.send(global.config)
        });

        router.get("/constants", (req, res) => {
            return res.send(global.config.constants)
        });

        router.get("/dws/{id}", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/songs/{id}", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/stars/{id}", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/stats", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/themes/{id}", (req, res) => {
            return res.sendStatus(502)
        });

        router.get("/unlock", (req, res) => {
            return res.sendStatus(502)
        });
        

    }
}