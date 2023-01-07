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
const logger = require("logger");
const uenc = require("uenc");
const scheduler = require("scheduler");

global.logger = logger;
global.httpSchema = require("./http-schema");

// Middlewares
app.use(express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morganMiddleware);
app.use(uenc.client);
app.use(validate);

app.set("trust proxy", "loopback");
app.disable("x-powered-by");
app.disable("etag");

app.use((req, res, next) => {
    res.set("Connection", "close");
    return next();
});

app.use("/api", require("./api/service"));
// app.post("/wdf", require("./services/api/service"));

app.get("/reset-playlist", (req, res, next)=> {
    global.memcached.flush()
    return res.sendStatus(200)
})
app.post("/wdfjd6", require("./load-funcs")("wdf-legacy"));

app.use(mids.errorHandler);
app.use(mids.notFound);

async function startJobs() {
    if (!global.args.ns)
        global.logger.info(`Starting schedule deletion job...`);
        await scheduler.sessionJob();
}
startJobs();

module.exports = app;