const fs = require("fs");
const express = require("express");
const router = express.Router();

const Playlist = require("wdf-playlist");

router.get("/get", async (req, res, next) => {
    const version = Number(req.query.version);
    if (!version) return next({
        status: 400,
        message: "Version query needed"
    });

    try {
        const playlist = new Playlist(version);
        const screens = await playlist.getScreens();
        return res.send(screens);
    }
    catch(err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

router.get("/reset", (req, res) => {
    global.memcached.flush();
    return res.sendStatus(200);
});

module.exports = router;