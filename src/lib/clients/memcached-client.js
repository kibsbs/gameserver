const { Client } = require("memjs");

module.exports = (cb) => {
    try {
        global.memcached = Client.create();
        return cb();
    }
    catch(err) {
        return cb(err)
    }
};