/**
 * JeanMich Configuration
 */

module.exports = {

    port: 3000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    database: require("../../secrets/mongodb")[global.ENV],

    secrets: require("./secrets"),
    games: require("../../games"),


    cdn: {
        url: "https//cdn.danceparty.online",
        paths: {
            covers: `gs/wdf/songs/covers`
        }
    },

}