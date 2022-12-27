/**
 * GAMESERVER
 */

// Register aliases
require("./aliases")();

const fs = require("fs");
const path = require("path");
const http = require("http");
const async = require("async");
const dotenv = require("dotenv");
const logger = require("signale");

let config;
let service;
let serviceConfig;

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
                global.ENV = args.env || process.env.ENV || "local";
                global.PORT = args.port || serviceConfig.PORT || 5000;
                return cb();
            });
        },
        (cb) => {
            // Initate clients before proceeding
            logger.wait("Initalizing clients...");

            // Database
            if (service.clients.includes("db")) {
                let connectionUri = config.DATABASE[service.id]["local"];
                require("./lib/clients/db-client")(connectionUri, (err, ok) => {
                    if (err) return cb(err);
                    logger.success("Connected to Database client!");
                });
            }

            logger.success("Initalized all clients!");
            return cb();
        },
        (cb) => {
            // Initate provided service
            const base = service.base;
            const script = service.path;

            logger.wait(`Starting service ${service.name}...`);

            // - Set globals
            global.service = service;
            global.secrets = config.secrets;
            // Service
            global.config = serviceConfig;
            global.config.service = global.service;
            global.gs = config;
            // -
            
            const app = require(script);
            return cb(null, app)
        },
        (app, cb) => {
            // Start the service
            http.createServer(app).listen(global.PORT);
            logger.success(`Started service ${service.name} on port ${global.PORT} successfully!`);
            return cb();
        }
    ],
    function (err, status) {
        if (err) throw new Error(err);
    }
);