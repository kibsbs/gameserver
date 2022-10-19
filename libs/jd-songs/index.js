
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

    async getRandomMap(filter = {}, size = 1) {
        const result = await this.db.aggregate([
          { $match: filter },
          { $sample: { size } }
        ])
        return result[0] ? result[0] : {} 
    }

    async exists(query = {}) {
        return await this.db.exists(query)
    }

    async delete(query = {}) {
        return await this.db.findOneAndDelete(query)
    }

    /**
     * @DEPRECATED
     * @param {*} mapName 
     * @returns 
     */
    async getMapLength(mapName) {
        const songDesc = await this.getByMapName(mapName)
        if (!songDesc) throw new Error(`Cannot find songDesc of ${mapName}`)
    
        const musicTrackData = songDesc.musicTrackData
        const markers = musicTrackData.markers
        
        let startBeat = Math.abs(musicTrackData.startBeat)
        let endBeat = musicTrackData.endBeat
        
        let startMarker = markers[startBeat]
        let endMarker
        
        if (markers.indexOf(endBeat) === -1) {
          let gap = markers[markers.length-1] - markers[markers.length-2]
          let markersLength = markers.length-1
          let amountToCalculate = endBeat - markersLength
          let interpedSample = gap * amountToCalculate
          endMarker = markers[markers.length-1] + interpedSample
        }
        else endMarker = markers[endBeat]
    
        let finalSongLength = (startMarker + endMarker)
        return ((finalSongLength / 48000) * 1000)
    }

}

module.exports = new Songs();