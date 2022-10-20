
const env = global.ENV || "DEV"
const config = global.config || require(`../../config/services/${global.service.name}`);
const port = global.config.port

const utils = require("utils")
const logger = require("logger")(["Galaxy"])
global.logger = logger

const express = require("express");
const async = require("async");
const fs = require("fs");

const app = express();

app.set("etag", false);
app.disable("x-powered-by");

// ---------------------------
// Load all services that are used by Galaxy
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
  var router = express.Router({
    caseSensitive: true,
    strict: true
  })

  var urlPrefix = "/" + serviceName + "/" + version

  require(filepath).init(app, router, urlPrefix)
  app.use(urlPrefix, router)
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