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

    functions: {
        checkToken: {
            id: 1023
        },
        connectToWDF: {
            id: 1166
        },
        disconnectFromWDF: {
            id: 1695
        },
        getBloomBergs2: {
            id: 1374
        },
        getMyRank: {
            id: 914
        },
        getPlayListPos: {
            id: 1444
        },
        getPlayerScores: {
            id: 1564
        },
        getRandomPlayers: {
            id: 1665
        },
        getRandomPlayersWMap: {
            id: 2038
        },
        getServerTime: {
            id: 1350
        }
    },

    games: require("../../games")

}