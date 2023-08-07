
// Memcached configuration per service and per enviroment.
module.exports = {
    wdf: {
        local: "127.0.0.1:11212",
        dev: "127.0.0.1:11212",
        prod: "127.0.0.1:11211",
        qc: "127.0.0.1:11213",
    },
    migrateDb: {
        local: "127.0.0.1:11212",
        dev: "127.0.0.1:11212",
        prod: "127.0.0.1:11211",
        qc: "127.0.0.1:11213",
    }
};