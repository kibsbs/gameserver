const fs = require("fs");
const express = require("express");
const router = express.Router();

const utils = require("utils");
const games = require("games");

/**
 * @api {get} /config/games Get all games
 * @apiName GetGames
 * @apiGroup Config
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object[]} games List of all games
 */
router.get("/games", (req, res) => {
    return res.json({
        games: global.gs.GAMES
    });
});

/**
 * @api {get} /config/games/:idOrVersion Get specific game
 * @apiName GetGame
 * @apiGroup Config
 * @apiVersion 1.0.0
 *
 * @apiParam {String} idOrVersion Game ID (SJME) or game version (2015)
 * 
 * @apiSuccess {String} name Game name
 * @apiSuccess {Number} version Game version
 * @apiSuccess {Boolean} ported Is the game a port? (ex: 2023 ported to Wii)
 * @apiSuccess {Boolean} mod Is the game a mod?
 * @apiSuccess {Boolean} isAvailable Is the game available for WDF?
 * @apiSuccess {Object} regions Game regions by ID
 * @apiSuccess {Object} stats Game statistics for total stars, avatars etc.
 * @apiSuccess {Number} maxStars Maximum stars for the game
 * @apiSuccess {String} wdfName ID of the game's WDF room
 * @apiSuccess {Boolean} isJD5 Is the game based on 2014?
 * @apiSuccess {Boolean} isJD15 Is the game based on 2015?
 */
router.get("/games/:idOrVersion", (req, res, next) => {
    const idOrVersion = req.params.idOrVersion;
    const isAvailable = games.isGameAvailable(idOrVersion);
    if (!isAvailable) return next({
        status: 404,
        message: `${idOrVersion} is an unknown game!`
    });

    const game = games.getGameById(idOrVersion) || games.getGameByVersion(idOrVersion);
    return res.json(game);
});

module.exports = router;