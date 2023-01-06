/**
 * GAMESERVER
 */

// Register aliases
require("./aliases")();

// see TODO #1
global.ENV = "local";

const fs = require("fs");
const path = require("path");
const http = require("http");
const async = require("async");
const dotenv = require("dotenv");
const logger = require("logger");
const migrateDb = require("./migrate-db");


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
async.waterfall(
    [
        (cb) => {
            // Start CLI progress
            const args = require("./cli")();
            return cb(null, args);
        },
        (args, cb) => {
            // Load Gameserver configuration
            dotenv.config(); // Resolve env file

            require("./lib/load-config").gs((err, conf) => {
                if (err) return cb(err);
                config = conf;
                return cb(null, args);
            });
        },
        (args, cb) => {
            // Set service information
            service = config.SERVICES[args.service];
            service.path = path.resolve(__dirname, service.path);
            service.base = path.resolve(__dirname, path.dirname(service.path));

            // Load service's configuration
            require("./lib/load-config").service(service, (err, conf) => {
                if (err) return cb(err);
                serviceConfig = conf;
                return cb(null, args);
            });
        },
        (args, cb) => {
            // Set ENV and PORT
            global.ENV = args.env || process.env.ENV || serviceConfig.ENV || "local";
            global.PORT = args.port || process.env.PORT || serviceConfig.PORT || 5000;
            return cb();
        },
        (cb) => {
            // Initate clients before proceeding
            logger.info("Initalizing clients...");

            // Database
            if (service.clients.includes("db")) {
                let connectionUri = process.env.DB_URI || config.DATABASE[service.id][global.ENV];
                require("./lib/clients/db-client")(connectionUri, (err, ok) => {
                    if (err) return cb(err);
                    logger.success("Connected to Database client!");
                });
            }
            if (service.clients.includes("memcached")) {
                require("./lib/clients/memcached-client")((err, ok) => {
                    if (err) return cb(err);
                    logger.success("Connected to Memcached client!");
                });
            };
            logger.success("Initalized all clients!");
            return cb();
        },
        (cb) => {
            // If DB exists, call database migration
            if (service.clients.includes("db")) {
                migrateDb.migrateSongs((err, ok) => {
                    if (err) return cb(err);
                    if (ok) logger.success("Migrated songs successfully!");
                    return cb();
                })
            }
            else return cb();
        },
        (cb) => {
            // Initate provided service
            const base = service.base;
            const script = service.path;

            logger.info(`Starting service ${service.name}...`);

            // - Set globals
            global.service = service;
            global.secrets = config.SECRETS;
            // Service
            global.config = serviceConfig;
            global.config.service = global.service;
            global.gs = config;
            // -
            global.project = require("../package.json");
            
            const app = require(script);
            return cb(null, app)
        },
        (app, cb) => {
            // Start the service
            http.createServer(app).listen(global.PORT);
            logger.success(`Service ${service.name} is listening on port ${global.PORT} in '${global.ENV}' enviroment successfully!`);
            return cb();
        }
    ],
    function (err) {
        if (err) throw new Error(err);
    }
);