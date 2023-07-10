/**
 * GAMESERVER
 */

require("dotenv").config();
require("./aliases")();

// see TODO #1
global.ENV = "local";

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const async = require("async");
const dotenv = require("dotenv");
const logger = require("./lib/logger")("gameserver");
const migrateDb = require("./migrate-db");

const dbClient = require("./lib/clients/db-client");
const redisClient = require("./lib/clients/redis-client");
const memcachedClient = require("./lib/clients/memcached-client");

const utils = require("./lib/utils");

global.logger = logger;

let config;
let service;
let serviceConfig;

// We use waterfall to run functions in order, here's an explanation (will be better in time)
// 1. Start the CLI and wait for client's arguments, get the selected service
// 2. Load .env and gameserver's configuration
// 3. Set service's information
// 4. Load service's configuration 
// and set ENV either from arguments, .env file or set default value
// do the same for PORT, from args, service's config or default value
// 5. Initalize any client the service requires
// 6. Start the service and define configs under global for easy access
// It's all confusing at the moment, which will be improved in future
(async() => {
    // Start CLI progress
    const args = require("./cli")();
    global.args = args;

    // Load gameserver configuration
    config = require("./lib/load-config").gs();

    // Set service information
    service = config.SERVICES[args.service];
    service.path = path.resolve(__dirname, service.path);
    service.base = path.resolve(__dirname, path.dirname(service.path));

    // Load service configuration
    serviceConfig = require("./lib/load-config").service(service);

    // Set ENV and PORT
    global.ENV = args.env || process.env.ENV || serviceConfig.ENV || "local";
    global.HTTP_PORT = args.httpPort || process.env.HTTP_PORT || serviceConfig.HTTP_PORT || 5000;
    global.HTTPS_PORT = args.httpsPort || process.env.HTTPS_PORT || serviceConfig.HTTPS_PORT || global.HTTPS_PORT + 443 || 5443;
    global.IS_TEST_MODE = args.testMode || serviceConfig.IS_TEST_MODE || false;
    global.IS_ON_CLOUDFLARE = serviceConfig.IS_ON_CLOUDFLARE || config.IS_ON_CLOUDFLARE || false;
    global.FQDN = serviceConfig.FQDN || null;

    // Set globals for service and gs
    global.config = serviceConfig;
    global.config.service = global.service;
    global.service = service;
    global.gs = config;
    global.secrets = config.SECRETS;
    global.project = require("../package.json");
    global.jobs = [];
    global.isDev = utils.isDev();

    // If service has any clients, initalize them
    const clients = service.clients || [];
    if (clients.length > 0) {
        logger.info("Initalizing clients...");

        const dbURI = process.env.DB_URI || config.DATABASE[service.id][global.ENV];
        const redisURI = process.env.REDIS_URI || config.REDIS[service.id][global.ENV];

        if (clients.includes("db")) {
            await dbClient(dbURI);
            global.logger.info("Initalized Database client!");
        }
        if (clients.includes("redis")) {
            await redisClient(redisURI);
            global.logger.info("Initalized Redis client!");
        }
        if (clients.includes("memcached")) {
            memcachedClient();
            global.logger.info("Initalized Memcached client!");
        }

        logger.success("Initalized all clients!");
    }

    // DB migration here TODO

    // Initate provided service
    logger.info(`Starting service ${service.name}...`);
    
    const { app, credentials = null } = require(service.path);

    // Start HTTP server first
    const httpServer = http.createServer(app);
    httpServer.listen(global.HTTP_PORT, () => {
        logger.success(`Service ${service.name} is listening on port HTTP ${global.HTTP_PORT} in '${global.ENV}' enviroment successfully.`);
    });

    // If credentials are given by service & SSL is enabled by Service config, start a HTTPS server
    if (credentials && serviceConfig.SSL == true) {
        const httpsServer = https.createServer({}, app);

        httpsServer.listen(global.HTTPS_PORT, () => {
            logger.success(`Service ${service.name} is listening on port HTTPS ${global.HTTPS_PORT} in '${global.ENV}' enviroment successfully.`);
        });
    };

})();