const fs = require("fs");
const express = require("express");
const router = express.Router();

const leaderboard = require("leaderboard");

/**
 * @api {get} /leaderboard/song/:songId Get top scores of specific song
 * @apiName GetSongLeaderboard
 * @apiGroup Leaderboard
 * @apiVersion 1.0.0
 *
 * @apiQuery {Number} limit Limit of the results
 * @apiParam {String} songId Hashed ID of a song
 * 
 * @apiSuccess {Object[]} leaderboard Leaderboard entries
 * @apiSuccess {Number} totalEntryCount Amount of total registered scores
 */
router.get("/song/:songId", async(req, res, next) => {
    try {
        const songId = req.params.songId;
        const version = Number(req.query.version);
        const limit = Number(req.query.limit || 3);
        
        const board = await leaderboard.getBoard(songId, version, null, limit);
        const entryCount = await leaderboard.getEntryCount(songId, version);

        return res.send({
            leaderboard: board,
            totalEntryCount: entryCount
        });
    }
    catch(err) {
        return next({
            status: 500,
            message: `Error occured on leaderboard: ${err}`,
            error: err.message
        });
    };
});

module.exports = router;