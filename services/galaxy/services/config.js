const fs = require("fs")

module.exports = {

    name: `SongDB`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["Galaxy", "SongDB"])

        router.get("/", async (req, res, next) => {
            return res.send(global.config)
        });

    }
}