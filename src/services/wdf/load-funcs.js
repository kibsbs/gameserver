const fs = require("fs");
const path = require("path");
const express = require("express");

const nasClient = require("nas-token-client");
const gameClient = require("games-client");
const dancercardClient = require("dancercard-client");
const songClient = require("songs-client");

const conf = {
    "wdf-jd5": {},
    "wdf-legacy": {
        checkToken: {
            id: 1023,
            mid: [nasClient.require, gameClient]
        },
        connectToWDF: {
            id: 1166,
            mid: [nasClient.require, gameClient]
        },
        disconnectFromWDF: {
            id: 1695,
            mid: [nasClient.require, gameClient]
        },
        getBloomBergs2: {
            id: 1374,
            mid: [nasClient.require, gameClient]
        },
        getMyRank: {
            id: 914,
            mid: [nasClient.require, gameClient]
        },
        getPlayerScores: {
            id: 1564,
            mid: [nasClient.require, gameClient]
        },
        getPlayListPos: {
            id: 1444
        },
        getRandomPlayers: {
            id: 1665,
            mid: [nasClient.require, gameClient]
        },
        getRandomPlayersWMap: {
            id: 2038,
            mid: [nasClient.require, gameClient]
        },
        getServerTime: {
            id: 1350
        }
    }
};

/**
 * This helps loading WDF functions with middlewares!
 * All you have to do is just use this lib as a middleware under wdf route
 * @param {*} wdfName 
 * @param {*} queryKey 
 * @returns 
 */
module.exports = (wdfName) => {

    let funcs = conf[wdfName];
    let queryKey = "d";

    return async (req, res, next) => {
        
        // The game requests data from query
        let func = req.query[queryKey];
        if (!func)
            return next({
                status: 400,
                message: "Missing func query"
            });

        // Check if the func's script file exists
        let funcPath = path.resolve(__dirname, "services/", wdfName, func + ".js");
        if (!fs.existsSync(funcPath))
            return next({
                status: 404,
                message: "Unknown func"
            });
        
        let funcScript = await require(funcPath).init;

        let middleware;

        if (funcs.hasOwnProperty(func)) {
            let funcData = funcs[func];
            middleware = [...funcData.mid, funcScript];
            req.func = {
                id: funcData.id,
                name: func
            }
        }
            
        else return next();

        return express.Router().use(middleware)(req, res, next);
    }
};