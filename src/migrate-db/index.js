
module.exports.migrateSongs = (cb) => {
    const model = require("../lib/models/song");

    const songdb = require("./songdb.json");
    const songdb2014 = require("./songdb-2014.json");
    const songdbJDJ = require("./songdb-jdjapan.json");
    const songdbJDB = require("./songdb-jdbeats.json");
    const songs = [
        ...songdb,
        ...songdb2014,
        ...songdbJDJ,
        ...songdbJDB
    ];

    const count = 0;

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        model.updateMany({
            mapName: song.mapName,
            version: song.version
        }, song, { upsert: true }, (err, ok) => {
            if (err) {
                global.logger.error(`Can't migrate songs: ${err}`);
                process.exit(1);
            }
            count += 1;
        });
    };
    global.logger.success(`Migrated ${count} songs successfully.`);
    return cb(null, true);
};