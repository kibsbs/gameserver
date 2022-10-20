
const env = global.ENV || "DEV"
const config = global.config || require(`../../config/services/${global.service.name}`);
const port = global.config.port

const utils = require("utils")
const logger = require("logger")(["WDF"])
global.logger = logger

const express = require("express");
const async = require("async");
const fs = require("fs");

const app = express();

app.set("etag", false);
app.disable("x-powered-by");

// ---------------------------
// Load all services
const services = {
    //"api": "api", not used anymore (use galaxy api)
    // "wdf": "wdf", // for 2014
    "wdfjd6": "wdf-jd6" // for 2015-2018
}

logger.info(`Running services: ${Object.keys(services).join(", ")}`)

for (var serviceName in services) {

    var path = `${__dirname}/services/${services[serviceName]}/index.js`

    var stats = fs.statSync(path)
    if (!stats.isFile()) continue;

    var urlPrefix = `/${serviceName}`

    var serviceRouter = express.Router({ 
        caseSensitive: true, 
        strict: true 
    });
    serviceRouter.use(express.urlencoded({
        extended: true
    }));

    require(path).init(app, serviceRouter, {
        serviceName
    })

    // To make access serialization while sending responses easier
    // We use uenc"s client that adds res.uenc and res.wdf for serialized respones
    app.use(require("uenc").client)
    
    app.use(urlPrefix, serviceRouter)
}
// ---------------------------

app.use(require("./middlewares/error-handler"));
app.get("/health", utils.healthCheck);

function main(done) {
	async.parallel([
		function(callback) {
            app.listen(port, () => {
                logger.info(`Service is listening on port: ${port}`)
                callback();
            })
		}
	], done);
}

module.exports = { main };