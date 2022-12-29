/**
 * JMCS service
 */

const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const logger = require("logger");
const morganMiddleware = require("morgan-middleware");
const uenc = require("uenc");

global.logger = logger;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/static"));
app.use(morganMiddleware);
app.use(express.json());
app.use(uenc.client);

// All sub-services that are used by JMCS
const services = {
    "BackOffice": "back-office",
    "ConstantProvider": "constant-provider",
    // "DancerCard": "dancer-card",
    // "HighScores": "high-scores",
    // "Leaderboard": "leaderboard",
    "Mashup": "mashup",
    "StarChallenge": "star-challenge",
    "Status": "status"
};

// Loop through services and load them
for (var serviceName in services) {

    let scriptPath = path.resolve(__dirname, "services", services[serviceName] + ".js");

    if (!fs.statSync(scriptPath).isFile()) continue;

    let route = `/${serviceName}`;
    let router = express.Router({ 
        caseSensitive: true, 
        strict: true 
    });

    require(scriptPath).init(app, router, route);
    app.use(route, router);
}

module.exports = app;