global.logger = require("./libs/logger")(["migrate-db"])

const dbClient = require("./clients/db-client")

async function migrate() {

    await dbClient({
        database: {
            path: `mongodb://127.0.0.1:27017`,
            db: "dp-wdf"
        }
    }, async (err, ok) => {

        const model = require("./services/wdf/models/song")

        const test = new model({
            "mapName": "AllAboutUs",
            "uniqueSongId": 8666695992856,
            "jdVersion": 2017,
            "title": "All About Us",
            "artist": "Jordan Fisher",
            "numCoach": 3,
            "difficulty": 2,
            "musicTrackData": {
                "__class": "MusicTrackData",
                "markers": [],
                "startBeat": -1,
                "endBeat": 350,
                "videoStartTime": -3.2260000705718994
            },
            "isAvailable": true
        })
        await test.save()


    })

    // TODO

}

migrate()
