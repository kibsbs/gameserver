
// Database configuration per service and per enviroment.
module.exports = {
    galaxy: {
        local: "",
        prod: "",
        dev: ""
    },
    jmcs: {
        local: "mongodb://127.0.0.1:27017/dp-jmcs-local",
        prod: "",
        dev: "",
        beta: "mongodb://127.0.0.1:27017/dp-jmcs-beta"
    },
    wdf: {
        local: "",
        prod: "",
        dev: ""
    }
}