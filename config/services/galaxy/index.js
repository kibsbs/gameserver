/**
 * JeanMich Configuration
 */

module.exports = {

    port: 5000,

    bypassAuth: false,
    publicServerMessages: true,
    logServerErrors: true,

    database: require("./database")[global.ENV],

    games: require("../../games"),


    cdn: {
        url: "https//cdn.danceparty.online",
        paths: {
            covers: `gs/galaxy/songs/covers`
        }
    },

}