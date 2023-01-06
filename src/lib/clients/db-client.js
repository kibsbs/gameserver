
const mongoose = require("mongoose");

module.exports = (url, cb) => {
    try {
        if (!url) throw new Error(`Database did not receive any connection url!`)
        mongoose.set('strictQuery', false);
        mongoose.connect(url, {});
        global.dbClient = mongoose.connection.getClient();
        return cb();
    }
    catch(err) {
        return cb(err)
    }
}