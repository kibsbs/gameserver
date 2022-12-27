
const mongoose = require("mongoose");

module.exports = (url, cb) => {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(url, {});
        return cb();
    }
    catch(err) {
        return cb(err)
    }
}