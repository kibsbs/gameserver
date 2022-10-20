
const env = global.ENV || "DEV"
const config = global.config || require(`../../config/services/${global.service.name}`);
const port = global.config.port

const utils = require("utils")
const logger = require("logger")(["Galaxy"])
global.logger = logger

const express = require("express");
const fs = require("fs");

const app = express();

app.set("etag", false);
app.disable("x-powered-by");

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