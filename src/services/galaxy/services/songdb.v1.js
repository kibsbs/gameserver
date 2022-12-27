const fs = require("fs")

const songs = require("jd-songs")

module.exports = {

    name: `SongDB`,
    description: `Handles all WDF routes for JD2015-2018`,
    version: `1.0.0`,

    async init(app, router, config) {

        const logger = require("logger")(["Galaxy", "SongDB"])

        function getFinalSongDesc(songdesc) {
            return {
                ...songdesc,
                assets: {
                    cover: `${global.config.cdn.url}/${global.config.cdn.paths.covers}/${songdesc.hash}.jpg`
                }
            }
        }

        router.get("/songs", async (req, res, next) => {
            // Get songdb and append all songs a coverUrl

            let songdb = await songs.db.find({ ...req.query }).lean();
            songdb = songdb.map(s => { return getFinalSongDesc(s) })

            return res.send(songdb)
        });

        router.get("/songs/:mapNameOrSongId", async (req, res, next) => {
            let param = req.params.mapNameOrSongId
            let query = { $or: [ { mapName: param }, { uniqueSongId: Number(param) || 0 } ] }
            
            let result = await songs.db.findOne(query).lean();
            
            if (!result) return next({
                status: 404,
                message: `${param} couldn't be found.`
            })
            else res.json(getFinalSongDesc(result))
        })
        

    }
}