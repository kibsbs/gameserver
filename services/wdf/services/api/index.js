const fs = require("fs")
const express = require("express")

module.exports = {

    name: `WDF JD6`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["WDF-API"])

        const services = {
            v1: {
                config: "config",
                playlist: "playlist",
                songdb: "song-db"
            }
        }

        runService("v1")
        
        function runService(version = "v1") {
            let servicesList = services[version]
            logger.info(`Running ${version} routes: ${Object.keys(servicesList).join(", ")}`)

            for (var serviceName in servicesList) {

                var path = `${__dirname}/${version}/${servicesList[serviceName]}.js`

                var stats = fs.statSync(path)
                if (!stats.isFile()) continue;

                var urlPrefix = `/${version}/${serviceName}`

                var serviceRouter = express.Router({ 
                    caseSensitive: true, 
                    strict: true 
                });
                serviceRouter.use(express.urlencoded({
                    extended: true
                }));

                require(path).init(router, serviceRouter, {
                    serviceName
                })
                
                router.use(urlPrefix, serviceRouter)
            }
        }
        // ---------------------------
        

    }
}