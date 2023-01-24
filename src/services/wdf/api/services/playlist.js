const fs = require("fs");
const express = require("express");
const router = express.Router();

const Playlist = require("wdf-playlist");
const cache = require("cache");

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

router.get("/reset", async (req, res, next) => {
    const version = Number(req.query.version);
    if (!version) return next({
        status: 400,
        message: "Version query needed"
    });

    try {
        const playlist = new Playlist(version);
        await playlist.resetScreens();
        return res.sendStatus(200);
    }
    catch(err) {
        return next({
            status: 400,
            message: err.message
        });
    }
});

module.exports = router;