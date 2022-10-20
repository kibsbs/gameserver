module.exports = {

    port: 3000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    maxScore: 13333,

    database: require("../../secrets/mongodb")[global.ENV],

    constants: require("./constants"),
    secrets: require("./secrets"),

    games: require("../../games")

}