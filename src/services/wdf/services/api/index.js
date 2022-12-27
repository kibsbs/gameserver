const fs = require("fs")
const express = require("express")

module.exports = {

    name: `WDF JD6`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["WDF-API"])

        const services = fs.readdirSync(`${__dirname}/services`)

        for (var i in services) {
            var filename = services[i]
            var filepath = `${__dirname}/services/${filename}`

            var stats = fs.statSync(filepath)
            if (!stats.isFile())
                continue;

            var parts = filename.split(".")
            var serviceName = parts[0]
            var version = parts[1]

            // Create a router for versions of service.
            // Example: /version/service/...
            var serviceRouter = express.Router({
                caseSensitive: true,
                strict: true
            })

            var urlPrefix = "/" + version + "/" + serviceName

            require(filepath).init(app, serviceRouter, urlPrefix)
            router.use(urlPrefix, serviceRouter)
        }
        // ---------------------------
        

    }
}