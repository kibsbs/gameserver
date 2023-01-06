const { Client } = require("memjs");

module.exports = (cb) => {
    try {
        const client = Client.create();
        global.memcached = client;
        return cb();
    }
    catch(err) {
        return cb(err)
    }
};