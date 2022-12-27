/**
 * GAMESERVER
 */

// -------------------------------

require("dotenv").config() // Load env config
//require("./lib/aliases").register(__dirname) // Register library aliases

// -------------------------------

const async = require("async");
const path = require("node:path");
const fs = require("fs");

const project = require("../package.json");

const logger = require("signale");

let config;
let service;
let serviceConfig;

async.waterfall(
    [
        (cb) => {
            // Load configuration
            require("./lib/load-config").gs((err, conf) => {
                if (err) return cb(err);
                config = conf;
                return cb();
            });
        },
        (cb) => {
            // Start CLI progress
            const args = require("./cli")(config);
            return cb(null, args);
        },
        (args, cb) => {
            // Set service from args and set it's config
            service = config.SERVICES[args.service];
            service.base = path.resolve(__dirname, path.dirname(service.path))
            require("./lib/load-config").service(service, (err, conf) => {
                if (err) return cb(err);
                serviceConfig = conf;
                return cb();
            });
        },
        (cb) => {
            // Initate clients before proceeding
            logger.wait("Initalizing clients...")

            // Database
            if (service.clients.includes("db")) {
                let connectionUri = config.DATABASE[service.id]["local"]
                require("./clients/db-client")(connectionUri, (err, ok) => {
                    if (err) return cb(err);
                    logger.success("Connected to Database client!");
                });
            }

            logger.success("Initalized all clients!")
            return cb();
        },
        (cb) => {
            // Initate provided service
            const base = service.base;
            const script = service.path;

            logger.wait(`Starting service ${service.name}...`);

            require(script)
        }
    ],
    function (err, status) {
        if (err) throw new Error(err);
    }
);