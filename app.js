// -------------------------------
// Register all library aliases
require("./libs/aliases").register(__dirname)

// -------------------------------

const async = require("async");
const path = require("node:path");
const fs = require("fs");

const project = require("./package.json");
const config = require("./config");
const aliases = require("./aliases")

const utils = require("utils");
const logger = require("logger")(["GS"]);
global.logger = logger

// -------------------------------
// To know which service to initiate, we use arguments.
// node app.js --service wii-2014 will start the "wii-2014" service.
const { Command } = require("commander");
const program = new Command();

program
    .name("DanceParty GS")
    .description("Initiate DanceParty GS services")
    .version(project.version)
    .option("-s, --service <serviceName>", "service name to initiate")
    .option("-e, --env <envName>", "enviroment for the service", "LOCAL")

if (process.argv.length < 3) program.help() // If no argument given show help

program.parse(process.argv);
const { service: serviceName, env: serviceEnv } = program.opts();
// -------------------------------

// If given service does not exist under GS config, throw an error.
if (!config.services[serviceName]) {
    return console.error(
        `"${serviceName}" is not an existing service.`,
        `\nAvailable services: ${Object.keys(config.services).join(", ")}`
    )
}

const srvPath = __dirname + config.services[serviceName].path
const srvAliases = path.resolve(srvPath, "..", "aliases.js")

logger.info(`Initiating service "${serviceName}"`)

global.ENV = serviceEnv.toLowerCase() || "local"
global.config = require(`./config/services/${serviceName}`) // Load service's config
global.clients = {}
global.service = {
    name: serviceName
}

// Each service will have it's own clients and required config keys 
// 1. Push all clients the service needs to "clients" array
// 2. Push all required keys that are meant to be in the service's config
let clients = [];
let reqKeys = [];

switch(serviceName) {

    case "galaxy":
        clients.push("dbClient", "localization")
        reqKeys.push("database")
        break;
    case "jeanmich":
        clients.push("dbClient", "localization")
        reqKeys.push("database")
        break;
    case "wdf":
        clients.push("redisClient", "dbClient", "localization")
        reqKeys.push("database", "redis")
        break;
    case "wdf-2014":
        clients.push("redisClient", "dbClient", "localization")
        reqKeys.push("database", "redis")
        break;

}

// Check if the required keys are in the service config
// If at least one isn't the process will stop
reqKeys.forEach((key) => {
	if (!global.config.hasOwnProperty(key)) {
		throw new Error(`ConfigException: Required key "${key}" is missing from ${serviceName} config.`);
	}
});

// Register service's aliases if they exist
if (aliases && aliases[serviceName]) {
    require("./libs/aliases").register(path.resolve(srvPath, ".."), aliases[serviceName])
}

logger.info(`Clients: ${clients.join(", ")}`)

process.on("uncaughtException", function(err) {
    logger.error(`uncaughtException: ${err}`)
    if (utils.isDev()) console.error(err)
	setTimeout(function() {
        process.exit(8);
    }, 2000);
});

async.auto({

    redisClient: function(callback) {
		if (!clients.includes("redisClient")) return callback();

        require('./clients/redis-client')(global.config, (err, client) => {
            if (err) return callback(err.toString());
			global.redisClient = client;
			return callback();
        });
	},

    dbClient: function(callback) {
		if (!clients.includes("dbClient")) return callback();

        require('./clients/db-client')(global.config, (err, connected) => {
            if (err) return callback(err.toString());
			return callback();
        });
	},

    localization: function(callback) {
        if (!clients.includes("localization")) return callback();

        global.clients.loc = require('./clients/loc-client');
		return callback();
	},
    
    runService: ["redisClient", "dbClient", "localization", function(results, callback) {
        const srv = require(srvPath)
        srv.main(callback);
	}]
}, function(err) {

	if (err) {
        logger.error(`Error occured while trying to initiate the clients ${err}`)
		process.exit(1);
	}
    
    logger.success(`Service initialized successfully.`)
});