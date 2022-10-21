const fs = require("fs")

const redisHelper = require("redis-helper")

const playlistLib = require("jd-playlist")
const songs = require("jd-songs")

module.exports = {

    name: `SongDB`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["WDFAPI", "Playlist"])

        router.get("/get", async (req, res, next) => {
            
            let version = req.query.version
            let playlist = new playlistLib(version)
            if (!version)
                return next({
                    status: 400,
                    message: `version query is required!`
                })

            try {
                return res.json(await playlist.getScreens())
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
        
        router.get("/themes", async (req, res, next) => {
            let communities = global.config.playlist.communities
            return res.json(communities)
        });

        router.put("/themes", async (req, res, next) => {
            
            let communities = global.config.playlist.communities
            let newTheme = req.body.theme

            if (!newTheme || newTheme.length !== 2) return next({
                status: 400,
                message: `Theme array must have only 2 theme names!`
            })

            communities.list.push(newTheme)
            communities.locs[newTheme[0]] = {
                en: newTheme[0]
            }
            communities.locs[newTheme[1]] = {
                en: newTheme[1]
            }

            fs.writeFileSync("./config/services/wdf/playlist/communities.json" ,JSON.stringify(communities,null,2))
            return res.sendStatus(200)
        });
    }
}