
const env = global.ENV || "DEV"
const config = global.config || require(`../../config/services/${global.service.name}`);
const port = global.config.port

const utils = require("utils")
const logger = require("logger")(["JeanMich"])
global.logger = logger

const express = require("express");
const async = require("async");
const fs = require("fs");

const app = express();

// ---------------------------
// Load all services that are used by JeanMich
const services = {
    "BackOffice": "back-office",
    "ConstantProvider": "constant-provider",
    "DancerCard": "dancer-card",
    "HighScores": "high-scores",
    "Leaderboard": "leaderboard",
    "Mashup": "mashup",
    "StarChallenge": "star-challenge"
}

for (var serviceName in services) {

    var filename = services[serviceName]
    var path = `${__dirname}/services/${filename}.js`

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

    require(path).init(app, serviceRouter, urlPrefix)

    // To make access serialization while sending responses easier
    // We use uenc's client that adds res.uenc and res.wdf for serialized respones
    app.use(require("uenc").client)
    
    app.use(urlPrefix, serviceRouter)
}
// ---------------------------

logger.info(`Running services: ${Object.keys(services).join(", ")}`)

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