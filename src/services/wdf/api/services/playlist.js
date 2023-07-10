const fs = require("fs");
const express = require("express");
const router = express.Router();

const Playlist = require("wdf-playlist");
const cache = require("cache");

/**
 * @api {get} /playlist/get Get playlist of a game
 * @apiName GetPlaylist
 * @apiGroup Playlist
 * @apiVersion 1.0.0
 *
 * @apiQuery {Number} version   Game version
 * 
 * @apiSuccess {Object} screens Screens
 * @apiSuccess {Object} screens.prev Previous screen
 * @apiSuccess {Object} screens.cur Current screen
 * @apiSuccess {Object} screens.next Next screen
 * @apiSuccess {Array} history History of the last 12 songs
 */
router.get("/get", async (req, res, next) => {
    const version = Number(req.query.version);
    if (!version) return next({
        status: 400,
        message: "Version query needed"
    });

    try {
        const playlist = new Playlist(version);
        const screens = await playlist.getScreens();
        const history = await playlist.getHistory();
        return res.send({
            screens,
            history
        });
    }
    catch(err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

/**
 * @api {get} /playlist/rotate Rotate playlist of a game
 * @apiDescription This route rotates playlist of the game, it might cause issues for clients in game since the game only syncs with the playlist everytime world time results end, not each interval.
 * @apiName RotatePlaylist
 * @apiGroup Playlist
 * @apiVersion 1.0.0
 *
 * @apiQuery {Number} version   Game version
 * 
 */
router.get("/rotate", async (req, res, next) => {
    const version = Number(req.query.version);
    if (!version) return next({
        status: 400,
        message: "Version query needed"
    });

    try {
        const playlist = new Playlist(version);
        const before = await playlist.getScreens();
        const screens = await playlist.rotateScreens();
        const after = await playlist.getScreens();
        const history = await playlist.getHistory();
        return res.send({
            before,
            after,
            history
        });
    }
    catch(err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

/**
 * @api {get} /playlist/reset Reset playlist of a game
 * @apiDescription This route resets playlist of the game, it might cause issues for clients in game since the game only syncs with the playlist everytime world time results end, not each interval.
 * @apiName ResetPlaylist
 * @apiGroup Playlist
 * @apiVersion 1.0.0
 *
 * @apiQuery {Number} version   Game version
 * 
 */
router.get("/reset", async (req, res, next) => {
    const version = Number(req.query.version);
    if (!version) return next({
        status: 400,
        message: "Version query needed"
    });

    try {
        const playlist = new Playlist(version);
        await playlist.resetScreens();
        await playlist.resetHistory();
        return res.sendStatus(200);
    }
    catch(err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

/**
 * @api {get} /playlist/reset-all Reset all playlists
 * @apiDescription This route resets playlist of all games, it might cause issues for clients in game since the game only syncs with the playlist everytime world time results end, not each interval.
 * @apiName ResetAllPlaylists
 * @apiGroup Playlist
 * @apiVersion 1.0.0
 *
 * @apiQuery {Number} version   Game version
 * 
 */
router.get("/reset-all", async (req, res, next) => {
    const games = require("games");
    const gamesList = games.getGames();

    // Reset playlist of all games
    for (let i = 0; i < gamesList.length; i++) {
        const { version } = gamesList[i];
        const playlist = new Playlist(version);
        await playlist.resetScreens();
    }
    return res.sendStatus(200);
});
module.exports = router;