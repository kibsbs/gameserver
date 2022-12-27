const express = require("express");
const app = express();

const path = require("path");

// All services that are used by JMCS
const services = {
    "BackOffice": "back-office",
    "ConstantProvider": "constant-provider",
    "DancerCard": "dancer-card",
    "HighScores": "high-scores",
    "Leaderboard": "leaderboard",
    "Mashup": "mashup",
    "StarChallenge": "star-challenge"
}

// Loop through services and load them
for (var serviceName in services) {

    let scriptPath = path.resolve(__dirname, "services", serviceName + ".js");

    if (!fs.statSync(scriptPath).isFile()) continue;

    let route = `/${serviceName}`;
    let router = express.Router({ 
        caseSensitive: true, 
        strict: true 
    });

    require(scriptPath).init(app, router, urlPrefix);
    app.use(urlPrefix, serviceRouter);
    
}

module.exports = app;