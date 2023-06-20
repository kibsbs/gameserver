const { Client } = require("memjs");

module.exports = (cb) => {
    try {
        const client = Client.create("127.0.0.1:11211");
        global.memcached = client;
        return;
    }
    catch(err) {
        throw new Error(`Can't connect to Memcached: ${err}`);
    }
};