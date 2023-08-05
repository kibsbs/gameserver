/**
 * Template service
 */

const express = require("express");
const app = express();

const morganMiddleware = require("morgan-middleware");
const mids = require("http-middleware");
const logger = require("logger")("nas");
const securityWall = require("security-wall");

const b64body = require("./lib/middlewares/b64-body");

global.logger = logger;

// Middlewares
app.use(express.urlencoded({ extended: true }));

app.set("trust proxy", "loopback");
app.disable("x-powered-by");
app.disable("etag");

app.use(securityWall);
app.use(morganMiddleware());

app.use("/example-route", b64body, require("./services/example-route"));

app.use(mids.errorHandler);
app.use(mids.notFound);

module.exports.app = app;