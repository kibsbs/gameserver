const fs = require("fs")
const path = require("node:path")

module.exports = {

    name: `SongDB`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["Galaxy", "Config"])

        router.get("/:serviceName", async (req, res, next) => {

            let serviceName = req.params.serviceName
            let servicePath = path.resolve(__dirname, "../../../config/services/" + serviceName + "/index.js")

            console.log(servicePath)
            if (!fs.existsSync(servicePath))
                return next({
                    status: 404,
                    message: `${serviceName} does not have a config!`
                })

            let config = require(servicePath)
            return res.send(config)
        });

    }
}