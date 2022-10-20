/**
 * JeanMich Configuration
 */

module.exports = {

    port: 3000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    maxScore: 13333,

    database: require("./database")[global.ENV],

    constants: require("./constants"),


    tokens: require("../../tokens"),
    games: require("../../games")

}