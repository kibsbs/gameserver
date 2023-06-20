/**
 * JMCS service
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const morganMiddleware = require("morgan-middleware");
const validate = require("http-validate");
const mids = require("http-middleware");
const logger = require("logger")("wdf");
const uenc = require("uenc");

const worker = require("./worker");
const loadFuncs = require("./load-funcs");

global.logger = logger;
global.httpSchema = require("./http-schema");

// Middlewares
app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morganMiddleware());
app.use(uenc.client);
app.use(validate);

app.set("trust proxy", "loopback");
app.disable("x-powered-by");
app.disable("etag");

app.use((req, res, next) => {
    res.set("Connection", "close");
    return next();
});

const rooms = {
    "wdf-jd5": "wdf",
    "wdf-jd15": "wdf-jd15",
    "wdf-legacy": "wdflgc"
};

app.use("/api", require("./api/service"));

// Only initate WDF rooms if server isn't in test mode
if (!global.IS_TEST_MODE) {
    // 2014 WDF
    app.post("/jd5", loadFuncs("wdf-jd5"));
    // 2015 WDF
    app.post("/jd2015", mids.agentCheck, loadFuncs("wdf-jd15"));
    // 2016 - 2017 - 2018 WDF
    app.post("/legacy", mids.agentCheck, loadFuncs("wdf-legacy"));
};

app.use(mids.errorHandler);
app.use(mids.notFound);

// Start worker
worker();

module.exports.app = app;