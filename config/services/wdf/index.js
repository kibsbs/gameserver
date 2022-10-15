module.exports = {

    port: 9000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    maxScore: 13333,

    database: {
        path: `mongodb://localhost:27017`,
        db: `dp-wdf`
    },
    redis: {
        host: "185.225.232.253",
        port: 6379,
        db: 0
    },

    constants: require("./constants"),
    secrets: require("./secrets"),
    timings: require("./timings"),
    lobby: require("./lobby"),
    functions: require("./functions"),

    games: require("../../games")

}