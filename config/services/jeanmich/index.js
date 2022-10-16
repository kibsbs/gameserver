module.exports = {

    port: 3000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    maxScore: 13333,

    database: {
        path: `mongodb://127.0.0.1:27017`,
        db: `dp-jeanmich`
    },
    redis: {
        host: "127.0.0.1",
        port: 6379,
        db: 0
    },

    constants: require("./constants"),
    secrets: require("./secrets"),

    games: require("../../games")

}