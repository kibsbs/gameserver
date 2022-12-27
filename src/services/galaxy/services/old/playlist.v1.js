const fs = require("fs")

const redisHelper = require("redis-helper")
const playlistLib = require("jd-playlist")

module.exports = {

    name: `SongDB`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["Galaxy", "Playlist"])

        router.get("/get", async (req, res, next) => {
            
            let version = req.query.version
            let playlist = new playlistLib(version)
            if (!version)
                return next({
                    status: 400,
                    message: `version query is required!`
                })

            try {
                return res.json(await playlist.getPlaylist())
            }
            catch(err) {
                return next({
                    status: 500,
                    message: err,
                    error: err
                })
            }
        });

        router.post("/reset", async (req, res, next) => {
            
            let version = req.query.version
            if (!version)
                return next({
                    status: 400,
                    message: `version query is required!`
                })

            try {
                redisHelper.resetQueue(version)
                return res.sendStatus(200)
            }
            catch(err) {
                return next({
                    status: 500,
                    message: err,
                    error: err
                })
            }
        });
        

    }
}