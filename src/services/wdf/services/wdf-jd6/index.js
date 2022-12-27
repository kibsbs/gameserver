const fs = require("fs")

module.exports = {

    name: `WDF JD6`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {
        
        global.logger = require("logger")(["WDF"])
        
        const session = require("jd-session")
        const query = require("query-middleware")

        logger.info(`Running functions: ${Object.keys(global.config.functions).join(", ")}`)

        router.get("/", (req, res, next) => {
            return res.send({
                functions: global.config.functions
            })
        })

        /**
         * Main route
         * 
         * The game will do POST connects under /wdfjd6/?d=example to get traffic of WDF
         */
        router.post("/",  
            require("schema-validator"),
            require("wdf-middleware")("wdfjd6", __dirname),
            require("session-client"),
        async (req, res, next) => {

            try {
                return await require(req.funcPath).init(req, res, next)
            }
            catch(err) {
                return next({
                    status: 500,
                    message: `${err}`,
                    error: [err]
                })
            }
            
        });

        router.get("/lobbies", query(10), async (req, res) => {
            return res.send(
                await require("jd-lobby").db
                .find({})
                .limit(req.limit)
            )
        });

        router.get("/sessions", query(10), async (req, res) => {
            return res.send(
                await require("jd-session").db
                .find({})
                .limit(req.limit)
            )
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