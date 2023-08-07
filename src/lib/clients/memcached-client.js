const { Client } = require("memjs");

module.exports = (memURI) => {
    try {
        const client = Client.create(memURI);
        global.memcached = client;
        return;
    }
    catch(err) {
        throw new Error(`Can't connect to Memcached: ${err}`);
    }
};