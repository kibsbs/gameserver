
// -------------------------------
// Register all library aliases
const moduleAlias = require("module-alias")
const aliases = require("./aliases")()

moduleAlias.addAliases(aliases)

// -------------------------------

const async = require("async");
const path = require("path");
const fs = require("fs");

const project = require("./package.json");
const config = require("./config");
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
    .option("-e, --env <envName>", "enviroment for the service", "DEV")

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

const srvConfig = require(`./config/services/${serviceName}`) // Load service's config
const srvPath = __dirname + config.services[serviceName].path
const srvEnv = serviceEnv || "DEV"
const srvAliases = path.resolve(srvPath, "..", "aliases.js")

global.ENV = srvEnv
global.config = srvConfig
global.clients = {}
global.service = {
    name: serviceName
}

logger.info(`Initiating service "${serviceName}"`)

// Each service will have it's own clients and required config keys.
// 1. Push all clients the service needs to "clients" array
// 2. Push all required keys that are meant to be in the service's config
let clients = [];

switch(serviceName) {

    case "jeanmich":
        clients.push("dbClient", "localization")
        break;
    case "wdf":
        clients.push("dbClient", "localization")
        break;
    case "wdf-2014":
        clients.push("redisClient", "dbClient", "localization")
        break;

}

// Check if the required keys are actually in the service config
// If at least one isn't, the process will stop
let reqKeys = ["database", "redis"];
reqKeys.forEach((key) => {
	if (!srvConfig.hasOwnProperty(key)) {
		throw new Error(`ConfigException: Required key "${key}" is missing from ${serviceName} config.`);
	}
});

// Register service's aliases if they exist.
if (fs.existsSync(srvAliases)) {
    moduleAlias.addAliases(require(srvAliases)(path.dirname(srvAliases)))
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

        require('./clients/redis-client')(srvConfig, (err, client) => {
            if (err) return callback(err.toString());
			global.redisClient = client;
			return callback();
        });
	},

    dbClient: function(callback) {
		if (!clients.includes("dbClient")) return callback();

        require('./clients/db-client')(srvConfig, (err, connected) => {
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