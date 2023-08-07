
// Database configuration per service and per enviroment.
module.exports = {
    jmcs: {
        local: "mongodb://127.0.0.1:27017/dp-legacy-local",
        prod: "mongodb://127.0.0.1:27017/dp-legacy-prod",
        dev: "mongodb://127.0.0.1:27017/dp-legacy-dev",
        qc: "mongodb://127.0.0.1:27017/dp-legacy-qc"
    },
    wdf: {
        local: "mongodb://127.0.0.1:27017/dp-legacy-local",
        prod: "mongodb://127.0.0.1:27017/dp-legacy-prod",
        dev: "mongodb://127.0.0.1:27017/dp-legacy-dev",
        qc: "mongodb://127.0.0.1:27017/dp-legacy-qc",
    },
    shop: {
        local: "mongodb://127.0.0.1:27017/dp-legacy-local",
        prod: "mongodb://127.0.0.1:27017/dp-legacy-prod",
        dev: "mongodb://127.0.0.1:27017/dp-legacy-dev",
        qc: "mongodb://127.0.0.1:27017/dp-legacy-qc",
    },
    migrateDb: {
        local: "mongodb://127.0.0.1:27017/dp-legacy-local",
        prod: "mongodb://127.0.0.1:27017/dp-legacy-prod",
        dev: "mongodb://127.0.0.1:27017/dp-legacy-dev",
        qc: "mongodb://127.0.0.1:27017/dp-legacy-qc",
    }
};