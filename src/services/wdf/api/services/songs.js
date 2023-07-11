const fs = require("fs");
const express = require("express");
const router = express.Router();

const songsDb = require("../../../../lib/models/song");

function getSubTitle(map) {

    const mapName = map.mapName;
    const difficulty = map.difficulty;
    const isAlt = mapName.endsWith("ALT");
    const isSweat = mapName.endsWith("SWT");
    const isOnStage = mapName.endsWith("OSC");
  
    if (isAlt && difficulty == 4) return "EXTREME";
    else if (isAlt) return "ALTERNATE";
    else if (isSweat) return "SWEAT";
    else if (isOnStage) return "ON-STAGE";
    
    return "";
};

/**
 * @api {get} /songs/all Get all songs in database
 * @apiName GetSongs
 * @apiGroup Songs
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {Object[]} songs Songs
 */
router.get("/all", async(req, res, next) => {
    const songs = await songsDb.find({});
    return res.send({ 
        songs: songs.map(s => ({...s.toJSON(), subTitle: getSubTitle(s)}))
    });
});

/**
 * @api {get} /songs/count Get amount of songs
 * @apiName GetSongsCount
 * @apiGroup Songs
 * @apiVersion 1.0.0
 * 
 * @apiSuccess {Number} count Count
 */
router.get("/count", async(req, res, next) => {
    return res.json({
        count: await songsDb.count()
    })
});

/**
 * @api {get} /songs/:idOrMapName Get specific song in database
 * @apiName GetSong
 * @apiGroup Songs
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} idOrMapName Song ID or Map Name of a song
 * 
 * @apiSuccess {Object} song Song object
 */
router.get("/:idOrMapName", async(req, res, next) => {
    const idOrMapName = req.params.idOrMapName;
    const song = await songsDb.findOne({
        $or: [{ songId: idOrMapName }, { mapName: idOrMapName}]
    });

    if (!idOrMapName || !song) return next({
        status: 404,
        message: `Can't find song!`
    });

    return res.send(song);
});

module.exports = router;