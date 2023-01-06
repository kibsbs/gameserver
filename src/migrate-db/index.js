
module.exports.migrateSongs = (cb) => {
    const model = require("../lib/models/song");
    const songdb = require("./songdb.json");

    model.insertMany(songdb, (err, ok) => {
        if (err) {
            let msg = err.message || "";
            if (msg.startsWith("E11000 duplicate key error collection"))
                return cb();
            else return cb(err);
        }
        return cb(null, true);
    });
};