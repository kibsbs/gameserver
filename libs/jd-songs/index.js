
class Songs {

    constructor() {
        this.db = require("models/song")
    }

    db() {
        return this.db
    }

    async new(songData) {
        try {
            let newSong = new this.db(songData)
            await newSong.save()
            return newSong
        }
        catch (err) {
            throw new Error(`Error occured while trying to create a song object:\n ${err}`)
        }
    }

    async get(query = {}) {
        return await this.db.findOne(query)
    }

    async getMany(query = {}, limit) {
        return await this.db.find(query).limit(limit)
    }

    async getByMapName(mapName) {
        return await this.db.findOne({ mapName })
    }

    async getBySongId(uniqueSongId) {
        return await this.db.findOne({ uniqueSongId })
    }

    async exists(query = {}) {
        return await this.db.exists(query)
    }

    async delete(query = {}) {
        return await this.db.findOneAndDelete(query)
    }

    async getMapLength(mapName) {

        const songDesc = await this.getByMapName(mapName)
        if (!songDesc) throw new Error(`Cannot find songDesc of ${mapName}`)

        const musicTrackData = songDesc.musicTrackData

        let finalEndBeat =
            musicTrackData.markers[parseInt(musicTrackData.endBeat)] / 48;

        // Some maps endBeat does not have a marker so we have to get the latest beat's marker
        if (!finalEndBeat) finalEndBeat = musicTrackData.markers[musicTrackData.markers.length - 1] / 48;

        let finalStartBeat =
            musicTrackData.markers[parseInt(Math.abs(musicTrackData.startBeat))] / 48;

        return parseInt(finalEndBeat + finalStartBeat);
    }

}

module.exports = new Songs();