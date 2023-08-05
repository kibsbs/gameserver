/**
 * Shop
 */

const express = require("express");
const app = express();

const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

const morganMiddleware = require("morgan-middleware");
const mids = require("http-middleware");
const logger = require("logger")("shop");
const securityWall = require("security-wall");

global.logger = logger;

// Middlewares
app.use(bodyParser.xml());
app.use(express.urlencoded({ extended: true }));

// Express
app.set("trust proxy", "loopback");
app.disable("x-powered-by");
app.disable("etag");

// Security wall & Morgan HTTP logger
app.use(securityWall);
app.use(morganMiddleware());

// Services
app.use("/ecs", (req, res, next) => {
    req.service = {
        id: "ecs",
        urn: "urn:ecs.wsapi.broadon.com"
    };
    return next();
}, require("./middlewares/soap"), require("./services/ecs"));

app.use("/cas", (req, res, next) => {
    req.service = {
        id: "cas",
        urn: "urn:cas.wsapi.broadon.com"
    };
    return next();
}, require("./middlewares/soap"), require("./services/cas"));

app.use("/ccs", (req, res, next) => {
    req.service = {
        id: "ccs",
        urn: "urn:ccs.wsapi.broadon.com"
    };
    return next();
}, require("./middlewares/soap"), require("./services/ccs"));

app.use("/ccs-cdn", (req, res, next) => {
    req.service = {
        id: "ccs",
        urn: "urn:ccs.wsapi.broadon.com"
    };
    return next();
}, require("./middlewares/soap"), require("./services/ccs-cdn"));

// 404 and error handlers
app.use(mids.errorHandler);
app.use(mids.notFound);

module.exports.app = app;